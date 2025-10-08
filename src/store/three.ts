import type { ViewportGizmo } from 'three-viewport-gizmo'
import { defineStore } from 'pinia'
import { ref, shallowRef, toRaw, triggerRef, watch, type ShallowRef } from 'vue'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import THREE, { enableBVH } from '@/three'
import { setGridHelper } from '@/three/utils/helpers/grid'
import { setupBlenderControls } from '@/three/utils/controls/blenderControls'
import { loadModel } from '@/three/utils/loaders/modelLoader'
import { setRaycaster } from '@/three/utils/core/raycaster'
import { useEventListener } from '@vueuse/core'
import { createComposer } from '@/three/utils/postprocess/composer'
import { cameraSetup } from '@/three/utils/camera/setup'
import type { OutlinePass } from 'three/examples/jsm/Addons.js'
import { useShadingControls } from '@/three/utils/renderer/shading'

export const useThreeStore = defineStore('three', () => {
	const { activeCamera, switchCamera } = cameraSetup()

	const scene = new THREE.Scene()
	scene.background = new THREE.Color('#3D3D3D')

	const controls = shallowRef<OrbitControls>()
	const outlinePass = ref<OutlinePass>()

	const gizmo = shallowRef<ViewportGizmo>()

	const sceneObjects = ref<THREE.Object3D[]>([])

	const shadingControls = useShadingControls(scene)

	watch(activeCamera, (newCamera) => {
		if (!controls.value || !gizmo.value) return
		controls.value.object = newCamera
		gizmo.value.camera = newCamera
	})

	async function initScene(canvasRef: ShallowRef<HTMLCanvasElement | null>) {
		if (!canvasRef.value) return
		const canvas = canvasRef.value

		if (!(activeCamera.value instanceof THREE.PerspectiveCamera)) return
		activeCamera.value.aspect = canvas.clientWidth / canvas.clientHeight

		const { pointer, raycaster } = setRaycaster(canvasRef)

		const newComposer = createComposer(canvas, scene, activeCamera)
		outlinePass.value = newComposer.outlinePass
		const { renderer, composer, resizeRendererToDisplaySize } = newComposer

		const grid = setGridHelper(scene)

		const blenderControls = setupBlenderControls(activeCamera.value, renderer)
		gizmo.value = blenderControls.gizmo
		controls.value = blenderControls.controls
		const transformHelper = blenderControls.transformControls.getHelper()
		scene.add(transformHelper)
		blenderControls.transformControls.addEventListener('objectChange', () => {
			triggerRef(selectedObject)
		})

		const clock = new THREE.Clock()

		const pointLight = new THREE.PointLight(0xffffff, 1)
		pointLight.position.set(0, 5, 0)
		const pointLightHelper = new THREE.PointLightHelper(pointLight, 0.5)
		// addObjectToScene(pointLight)
		scene.add(pointLight)
		addObjectToScene(pointLightHelper)

		shadingControls.init()

		renderer.setAnimationLoop(render)

		function render() {
			const delta = clock.getDelta()
			if (resizeRendererToDisplaySize()) {
				if (activeCamera.value instanceof THREE.PerspectiveCamera) {
					activeCamera.value.aspect = canvas.clientWidth / canvas.clientHeight
				}
				activeCamera.value.updateProjectionMatrix()
				gizmo.value?.update()
			}

			grid.update(activeCamera.value)
			controls.value?.update(delta)
			composer.render(delta)
			gizmo.value?.render()
		}

		useEventListener(canvasRef, 'click', () => {
			if (!outlinePass.value) return
			raycaster.setFromCamera(pointer, activeCamera.value)
			const intersects = raycaster.intersectObjects(toRaw(sceneObjects.value), true)
			if (intersects[0]) {
				const selected = intersects[0].object
				blenderControls.transformControls.attach(selected)
				outlinePass.value.selectedObjects = [selected]
				selectedObject.value = selected
			} else {
				blenderControls.transformControls.detach()
				outlinePass.value.selectedObjects = []
				selectedObject.value = null
			}
		})
	}

	function addObjectToScene(object: THREE.Object3D) {
		enableBVH(object)
		object.traverse((obj) => {
			if (obj instanceof THREE.Mesh) {
				obj.castShadow = true
				obj.receiveShadow = true
				obj.userData.isShadable = true
			}
		})
		scene.add(object)
		sceneObjects.value.push(object)

		shadingControls.cacheNewObjectMaterials(object)
	}

	/**
	 * Asynchronously imports a 3D model, processes it, and adds it to the scene.
	 *
	 * This function loads a model using the provided parameters (matching loadModel's signature),
	 * applies BVH (Bounding Volume Hierarchy) optimization, assigns a default name if missing,
	 * and adds the model to the active Three.js scene.
	 *
	 * @param params - Parameters passed directly to the loadModel function
	 *
	 * Processing steps:
	 * 1. Loads the model asynchronously
	 * 2. Validates the loaded model existence
	 * 3. Enables BVH optimization for physics/animation
	 * 4. Sets a default name if none exists
	 * 5. Adds the model to the global THREE.Scene instance
	 */
	async function importModel(...params: Parameters<typeof loadModel>): Promise<void> {
		const model = await loadModel(...params)
		if (!model) return
		model.name = model.name || 'Imported Model'
		addObjectToScene(model)
	}
	// _____________________________

	const selectedObject = ref<THREE.Object3D<THREE.Object3DEventMap> | null>(null)

	return {
		initScene,
		activeCamera,
		switchCamera,
		importModel,
		outlinePass,
		selectedObject,
		controls,
		sceneObjects,
		addObjectToScene,
		currentShadingMode: shadingControls.currentMode
	}
})
