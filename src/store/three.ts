import type { ViewportGizmo } from 'three-viewport-gizmo'
import { acceptHMRUpdate, defineStore } from 'pinia'
import { ref, shallowRef, toRaw, triggerRef, watch, type ShallowRef } from 'vue'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import THREE, { enableBVH } from '@/three'
import { setGridHelper } from '@/three/modules/helpers/grid'
import { setupBlenderControls } from '@/three/modules/controls/blenderControls'
import { loadModel } from '@/three/modules/loaders/modelLoader'
import { setRaycaster } from '@/three/modules/core/raycaster'
import { useEventListener } from '@vueuse/core'
import { createComposer } from '@/three/modules/postprocess/composer'
import { cameraSetup } from '@/three/modules/camera/setup'
import {
	RectAreaLightHelper,
	type OutlinePass,
	type TransformControls,
	type TransformControlsMode
} from 'three/examples/jsm/Addons.js'
import { useShadingControls } from '@/three/modules/renderer/shading'
import { useProgressStore, type LoadingProgress } from './progress'
import { disposeModel } from '@/three/modules/core/dispose'
import { createLight, getLightHelper, type LightHelper } from '@/three/modules/light'
import Stats from 'three/examples/jsm/libs/stats.module.js'

export const useThreeStore = defineStore('three', () => {
	const scene = new THREE.Scene()
	const helperScene = new THREE.Scene()
	scene.background = new THREE.Color('#3D3D3D')

	// Camera controls
	const { activeCamera, switchCamera } = cameraSetup()
	const controls = shallowRef<OrbitControls>()
	const gizmo = shallowRef<ViewportGizmo>()

	watch(activeCamera, (newCamera) => {
		if (!controls.value || !gizmo.value) return
		controls.value.object = newCamera
		gizmo.value.camera = newCamera
	})
	// _____________________________

	const outlinePass = ref<OutlinePass>()
	const shadingControls = useShadingControls(scene)

	const sceneObjects = ref<THREE.Object3D[]>([])
	const helperObjects = ref<THREE.Object3D[]>([])
	const raycasterObjects = ref<THREE.Object3D[]>([])
	const selectedObject = shallowRef<THREE.Object3D<THREE.Object3DEventMap> | null>(null)

	// Transform controls
	const transformControls = shallowRef<TransformControls>()
	const currentTransformMode = ref<TransformControlsMode>('translate')

	function setTransformMode(mode: TransformControlsMode) {
		transformControls.value?.setMode(mode)
		currentTransformMode.value = mode
	}
	// ___________________________

	const selectObject = shallowRef<(uuid?: string) => void>()

	const stats = new Stats()
	stats.dom.style.position = 'absolute'
	stats.dom.style.top = 'initial'
	stats.dom.style.bottom = '0px'
	const monitor = ref({
		memory: '',
		geometries: 0,
		textures: 0
	})

	function updateMonitor(renderer: THREE.WebGLRenderer) {
		if ('memory' in performance) {
			// @ts-expect-error Performance.memory is only available in Chrome
			const used = (performance.memory.usedJSHeapSize / 1048576).toFixed(2)
			monitor.value.memory = used
		}

		const gpu = renderer.info.memory
		monitor.value.geometries = gpu.geometries
		monitor.value.textures = gpu.textures
	}

	async function initScene(canvasRef: ShallowRef<HTMLCanvasElement | null>) {
		if (!canvasRef.value) return
		const canvas = canvasRef.value

		if (import.meta.env.DEV) canvas.parentElement?.appendChild(stats.dom)

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
		transformControls.value = blenderControls.transformControls
		const transformHelper = blenderControls.transformControls.getHelper()
		helperScene.add(transformHelper)

		// Object selection
		selectObject.value = (uuid?: string) => {
			if (!outlinePass.value || !uuid) return

			const object = scene.getObjectByProperty('uuid', uuid)

			if (!object) return

			blenderControls.transformControls.attach(object)
			outlinePass.value.selectedObjects = [object]
			selectedObject.value = object
		}

		blenderControls.transformControls.addEventListener('objectChange', () => {
			triggerRef(selectedObject)
		})

		blenderControls.transformControls.addEventListener('object-changed', (e) => {
			const object = e.target.object as unknown as THREE.Object3D | LightHelper | undefined
			if (!object) return

			if ('light' in object) {
				blenderControls.transformControls.attach(object.light)
			}

			if (object.userData.skipRaycast && object.parent) {
				blenderControls.transformControls.attach(object.parent)
			}
		})
		// ______________________

		const pointLightHelper = createLight({ type: 'PointLight', parameters: { intensity: 10 } })
		pointLightHelper.light.position.set(4, 5, 1)
		addLightHelperToScene(pointLightHelper)

		const clock = new THREE.Clock()
		renderer.setAnimationLoop(render)

		let passedTime = 0

		function render() {
			const delta = clock.getDelta()
			passedTime += delta
			if (resizeRendererToDisplaySize()) {
				if (activeCamera.value instanceof THREE.PerspectiveCamera) {
					activeCamera.value.aspect = canvas.clientWidth / canvas.clientHeight
				}
				activeCamera.value.updateProjectionMatrix()
				gizmo.value?.update()
			}

			grid.update(activeCamera.value)
			controls.value?.update(delta)
			stats.update()
			composer.render(delta)
			gizmo.value?.render()
			renderer.clearDepth()
			renderer.render(helperScene, activeCamera.value)

			if (passedTime > 1) {
				passedTime = 0
				updateMonitor(renderer)
			}
		}

		let wasDragging = false

		blenderControls.transformControls.addEventListener('dragging-changed', (e) => {
			wasDragging = !e.value // Set flag when dragging ends
		})

		useEventListener(canvasRef, 'click', () => {
			if (!outlinePass.value) return

			if (wasDragging) return (wasDragging = false)

			raycaster.setFromCamera(pointer, activeCamera.value)
			const intersects = raycaster.intersectObjects(toRaw(raycasterObjects.value), true)
			if (intersects[0]) {
				selectObject.value?.(intersects[0].object.uuid)
			} else {
				blenderControls.transformControls.detach()
			}
		})
	}

	function addModelToScene(object: THREE.Object3D) {
		object.traverse((obj) => {
			if (obj instanceof THREE.Mesh) {
				obj.castShadow = true
				obj.receiveShadow = true
				obj.userData.isShadable = true
				;(obj.material as THREE.Material).dithering = true
			}
			if (obj instanceof THREE.Light) {
				const helper = getLightHelper(obj)
				if (!helper) return

				object.add(helper)

				if (shadingControls.currentMode.value !== 'rendered') {
					helper.light.visible = false
				}
			}
		})
		enableBVH(object)
		scene.add(object)
		sceneObjects.value.push(object)
		raycasterObjects.value.push(object)

		shadingControls.cacheNewObjectMaterials(object)
		selectedObject.value = object
		transformControls.value?.attach(object)
		if (outlinePass.value) outlinePass.value.selectedObjects = [object]
		sceneObjects.value.filter((item) => !(item instanceof THREE.Light))
		raycasterObjects.value.filter((item) => !(item instanceof THREE.Light))
	}

	function addLightHelperToScene(helper: LightHelper) {
		scene.add(helper.light)
		scene.add(helper)

		if (shadingControls.currentMode.value !== 'rendered') {
			helper.light.visible = false
		}

		raycasterObjects.value.push(helper)
		helperObjects.value.push(helper)
		selectedObject.value = helper
		transformControls.value?.attach(helper.light)

		if (outlinePass.value) outlinePass.value.selectedObjects = [helper]
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
		const progressStore = useProgressStore()
		const [loadParams] = params
		const loadingId = `model-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`

		// Extract model name and filename from URL
		const urlParts = loadParams.url.split('/')
		const fullFilename = loadParams.filename || urlParts[urlParts.length - 1] || 'model'
		const modelName = fullFilename.split('.')[0] || 'Model'

		// Wrap the onProgress callback to track progress
		const originalOnProgress = loadParams.onProgress
		loadParams.onProgress = (e: ProgressEvent) => {
			if (e.lengthComputable) {
				if (progressStore.loadingItems.find((p: LoadingProgress) => p.id === loadingId)) {
					progressStore.updateProgress(loadingId, e.loaded)
				} else {
					progressStore.startLoading(loadingId, modelName, fullFilename, e.total)
				}
			}
			originalOnProgress?.(e)
		}

		try {
			const model = await loadModel(...params)
			if (!model) return
			model.name = modelName
			addModelToScene(model)
		} finally {
			progressStore.finishLoading(loadingId)
		}
	}
	// _____________________________

	function deleteFromScene(object: THREE.Object3D) {
		transformControls.value?.detach()

		if (
			object instanceof THREE.PointLightHelper ||
			object instanceof THREE.SpotLightHelper ||
			object instanceof THREE.DirectionalLightHelper ||
			object instanceof RectAreaLightHelper
		) {
			if (object.light) {
				scene.remove(object.light)
				disposeModel(object.light)
			}
		}

		const sceneObjIdx = sceneObjects.value.indexOf(object)
		if (sceneObjIdx !== -1) {
			sceneObjects.value.splice(sceneObjIdx, 1)
		}

		const helperObjIdx = helperObjects.value.indexOf(object)
		if (helperObjIdx !== -1) {
			helperObjects.value.splice(helperObjIdx, 1)
		}

		const raycasterObjIdx = raycasterObjects.value.indexOf(object)
		if (raycasterObjIdx !== -1) {
			raycasterObjects.value.splice(raycasterObjIdx, 1)
		}

		if (selectedObject.value === object) {
			selectedObject.value = null
		}

		if (outlinePass.value) {
			outlinePass.value.selectedObjects = outlinePass.value.selectedObjects.filter(
				(selected) => selected !== object
			)
		}

		disposeModel(object)
	}

	shadingControls.init()

	return {
		initScene,
		activeCamera,
		switchCamera,
		importModel,
		outlinePass,
		selectedObject,
		controls,
		sceneObjects,
		addModelToScene,
		currentShadingMode: shadingControls.currentMode,
		setTransformMode,
		currentTransformMode,
		deleteFromScene,
		transformControls,
		addLightHelperToScene,
		monitor,
		selectObject,
		raycasterObjects
	}
})

if (import.meta.hot) {
	import.meta.hot.accept(acceptHMRUpdate(useThreeStore, import.meta.hot))
}
