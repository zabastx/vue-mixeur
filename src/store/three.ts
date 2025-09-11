import type { ViewportGizmo } from 'three-viewport-gizmo'
import { defineStore } from 'pinia'
import { computed, markRaw, ref, shallowRef, watch, type ShallowRef } from 'vue'
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

export const useThreeStore = defineStore('three', () => {
	const { activeCamera, switchCamera } = cameraSetup()

	const scene = markRaw(new THREE.Scene())
	const controls = shallowRef<OrbitControls>()
	const outlinePass = ref<OutlinePass>()

	const gizmo = shallowRef<ViewportGizmo>()

	const sceneObjects = ref<THREE.Object3D[]>([])

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

		scene.background = new THREE.Color('#3D3D3D')

		const grid = setGridHelper(scene)

		const blenderControls = setupBlenderControls(activeCamera.value, renderer)
		gizmo.value = blenderControls.gizmo
		controls.value = blenderControls.controls

		const cube = new THREE.Mesh(
			new THREE.BoxGeometry(),
			new THREE.MeshBasicMaterial({ color: 0x00ff00 })
		)
		cube.name = 'Companion Cube'
		addObjectToScene(cube)

		const clock = new THREE.Clock()

		scene.add(new THREE.AmbientLight(0xffffff, 0.2))
		const dirLight = new THREE.DirectionalLight(0xffffff, 1)
		dirLight.position.set(5, 10, 5)
		scene.add(dirLight)

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
			const intersects = raycaster.intersectObjects(sceneObjects.value, true)
			console.log('inter', intersects)
			if (intersects[0]) {
				const selected = intersects[0].object
				outlinePass.value.selectedObjects = [selected]
			} else {
				outlinePass.value.selectedObjects = []
			}
		})
	}

	function addObjectToScene(object: THREE.Object3D) {
		enableBVH(object)
		scene.add(object)
		sceneObjects.value.push(object)
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
		// enableBVH(model)
		model.name = model.name || 'Imported Model'
		// scene.add(model)
		addObjectToScene(model)
	}
	// _____________________________

	const selectedObject = computed(() => outlinePass.value?.selectedObjects[0] || null)

	return {
		initScene,
		activeCamera,
		switchCamera,
		importModel,
		outlinePass,
		selectedObject,
		controls
	}
})
