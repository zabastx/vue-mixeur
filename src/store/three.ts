import type { ViewportGizmo } from 'three-viewport-gizmo'
import { acceptHMRUpdate, defineStore } from 'pinia'
import { computed, ref, shallowRef, triggerRef, watch, type ShallowRef } from 'vue'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import THREE, { enableBVH } from '@/three'
import { setGridHelper } from '@/three/modules/helpers/grid'
import { setupBlenderControls } from '@/three/modules/controls/blenderControls'
import { loadModel, type ModelLoaderParameters } from '@/three/modules/loaders/modelLoader'
import { setRaycaster } from '@/three/modules/core/raycaster'
import { useEventListener } from '@vueuse/core'
import { createComposer } from '@/three/modules/postprocess/composer'
import { cameraSetup } from '@/three/modules/camera/setup'
import {
	type OutlinePass,
	type TransformControls,
	type TransformControlsMode
} from 'three/examples/jsm/Addons.js'
import { useShadingStore } from '@/store/shading'
import { useProgressStore, type LoadingProgress } from './progress'
import { disposeModel } from '@/three/modules/core/dispose'
import { createLight, getLightHelper, type LightHelper } from '@/three/modules/light'
import { useStats } from '@/three/modules/extras/stats'

export const useThreeStore = defineStore('three', () => {
	const scene = new THREE.Scene()
	const helperScene = new THREE.Scene()
	scene.background = new THREE.Color('#3D3D3D')

	const grid = setGridHelper(scene)

	const pointLightHelper = createLight({ type: 'PointLight', parameters: { intensity: 10 } })
	pointLightHelper.light.position.set(4, 5, 1)

	const raycasterObjects: THREE.Object3D[] = []
	const lightHelperObjects: LightHelper[] = []

	const sceneChildren = computed(() => scene.children)
	scene.addEventListener('childadded', () => {
		triggerRef(sceneChildren)
	})
	scene.addEventListener('childremoved', () => {
		triggerRef(sceneChildren)
	})
	function updateScene() {
		triggerRef(sceneChildren)
	}

	// Camera controls
	const { activeCamera, switchCamera } = cameraSetup()
	const controls = shallowRef<OrbitControls>()
	const gizmo = shallowRef<ViewportGizmo>()

	watch(activeCamera, (newCamera) => {
		if (!controls.value || !gizmo.value) return
		controls.value.object = newCamera
		gizmo.value.camera = newCamera
	})
	// --------------------------------------

	const outlinePass = shallowRef<OutlinePass>()
	const shadingStore = useShadingStore()

	const selectObject = shallowRef<(uuid?: string) => void>()
	const selectedObject = ref<THREE.Object3D | THREE.Light | THREE.Mesh | null>(null)

	// Transform controls
	const transformControls = shallowRef<TransformControls>()
	const currentTransformMode = ref<TransformControlsMode>('translate')

	function setTransformMode(mode: TransformControlsMode) {
		transformControls.value?.setMode(mode)
		currentTransformMode.value = mode
	}
	// ----------------------------------------

	const { initStats, monitor, stats } = useStats()

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
		shadingStore.init(scene)
		addLightHelperToScene(pointLightHelper)

		if (import.meta.env.DEV) initStats(canvas.parentElement)

		if (!(activeCamera.value instanceof THREE.PerspectiveCamera)) return
		activeCamera.value.aspect = canvas.clientWidth / canvas.clientHeight

		const newComposer = createComposer(canvas, scene, activeCamera)

		const { renderer, composer, resizeRendererToDisplaySize } = newComposer

		const blenderControls = setupBlenderControls(activeCamera.value, renderer)
		gizmo.value = blenderControls.gizmo
		controls.value = blenderControls.controls
		transformControls.value = blenderControls.transformControls
		const transformHelper = blenderControls.transformControls.getHelper()
		helperScene.add(transformHelper)

		// Object selection
		outlinePass.value = newComposer.outlinePass

		selectObject.value = (uuid?: string) => {
			if (!outlinePass.value || !uuid) return

			const object = scene.getObjectByProperty('uuid', uuid)

			if (!object) return

			if (object instanceof THREE.Light) {
				blenderControls.transformControls.attach(object)
				selectedObject.value = object
				const helper = scene.getObjectByProperty('light', object)
				if (helper) {
					outlinePass.value.selectedObjects = [helper]
				}
				return
			}

			if ('light' in object) {
				const light = object.light as THREE.Light
				blenderControls.transformControls.attach(light)
				outlinePass.value.selectedObjects = [object]
				selectedObject.value = light
				return
			}

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
				selectedObject.value = object.light
				return
			}

			if (object.userData.skipRaycast && object.parent) {
				blenderControls.transformControls.attach(object.parent)
				selectedObject.value = object.parent
			}
		})
		// -------------------------

		// Raycasting
		const { pointer, raycaster } = setRaycaster(canvasRef)

		let wasDragging = false

		blenderControls.transformControls.addEventListener('dragging-changed', (e) => {
			wasDragging = !e.value // Set flag when dragging ends
		})

		useEventListener(canvasRef, 'click', () => {
			if (!outlinePass.value) return

			if (wasDragging) return (wasDragging = false)

			raycaster.setFromCamera(pointer, activeCamera.value)
			const intersects = raycaster.intersectObjects(raycasterObjects, true)

			if (!intersects[0]) {
				blenderControls.transformControls.detach()
				return
			}

			selectObject.value?.(intersects[0].object.uuid)
		})
		// -----------------------------

		const clock = new THREE.Clock()
		let passedTime = 0
		renderer.setAnimationLoop(render)

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
			lightHelperObjects.forEach((item) => {
				if ('update' in item) item.update()
			})
			composer.render(delta)
			gizmo.value?.render()
			renderer.clearDepth()
			renderer.render(helperScene, activeCamera.value)

			if (passedTime > 1) {
				passedTime = 0
				updateMonitor(renderer)
			}
		}
	}

	function addModelToScene(object: THREE.Object3D) {
		object.traverse((obj) => {
			if (obj instanceof THREE.Mesh) {
				obj.userData.isShadable = true
				;(obj.material as THREE.Material).dithering = true
			}
			if (obj instanceof THREE.Light) {
				const helper = getLightHelper(obj)
				if (!helper) return

				object.add(helper)

				if (shadingStore.currentMode !== 'rendered') {
					helper.light.visible = false
				}
			}
		})
		enableBVH(object)
		scene.add(object)
		raycasterObjects.push(object)

		shadingStore.cacheNewObjectMaterials(object)
		selectedObject.value = object
		transformControls.value?.attach(object)
		if (outlinePass.value) outlinePass.value.selectedObjects = [object]
	}

	function addLightHelperToScene(helper: LightHelper) {
		scene.add(helper.light)
		scene.add(helper)

		if (shadingStore.currentMode !== 'rendered') {
			helper.light.visible = false
		}

		raycasterObjects.push(helper)
		lightHelperObjects.push(helper)
		selectedObject.value = helper.light
		transformControls.value?.attach(helper.light)

		if (outlinePass.value) outlinePass.value.selectedObjects = [helper]
	}

	function deleteFromScene(object: THREE.Object3D) {
		transformControls.value?.detach()

		if (object instanceof THREE.Light) {
			const objectsForRemoval: THREE.Object3D[] = [object]
			scene.traverse((child: THREE.Object3D | LightHelper) => {
				if ('light' in child && child.light.uuid === object.uuid) {
					objectsForRemoval.push(child)
					const idx = lightHelperObjects.findIndex((item) => child.uuid === item.uuid)
					if (idx < 0) return
					lightHelperObjects.splice(idx, 1)
				}
			})
			objectsForRemoval.forEach((obj) => {
				scene.remove(obj)
			})
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

	/**
	 * Asynchronously imports a 3D model, processes it, and adds it to the scene.
	 *
	 * This function loads a model using the provided parameters (matching loadModel's signature),
	 * applies BVH (Bounding Volume Hierarchy) optimization, assigns a default name if missing,
	 * and adds the model to the active Three.js scene.
	 *
	 * @param params - Parameters passed directly to the loadModel function
	 */
	async function importModel(params: ModelLoaderParameters): Promise<void> {
		const progressStore = useProgressStore()
		const loadingId = `model-${Date.now()}-${Math.random().toString(36).slice(2)}`

		// Extract model name and filename from URL
		const urlParts = params.url.split('/')
		const fullFilename = params.filename || urlParts[urlParts.length - 1] || 'model'
		const modelName = fullFilename.split('.')[0] || 'Model'

		// Wrap the onProgress callback to track progress
		const originalOnProgress = params.onProgress
		params.onProgress = (e: ProgressEvent) => {
			if (e.lengthComputable) {
				if (progressStore.loadingItems.find((p: LoadingProgress) => p.id === loadingId)) {
					progressStore.updateProgress(loadingId, e.loaded)
				} else {
					progressStore.startLoading(loadingId, fullFilename, e.total)
				}
			}
			originalOnProgress?.(e)
		}

		try {
			const model = await loadModel(params)
			if (!model) return
			model.name = model.name || modelName
			addModelToScene(model)
		} finally {
			progressStore.finishLoading(loadingId)
		}
	}
	// -----------------------------

	function objectVisibilityUpdate(uuid: string, val: boolean) {
		const obj = scene.getObjectByProperty('uuid', uuid)
		if (obj) {
			obj.visible = val
			triggerRef(sceneChildren)
		}
	}

	return {
		initScene,
		activeCamera,
		switchCamera,
		importModel,
		outlinePass,
		selectedObject,
		controls,
		addModelToScene,
		setTransformMode,
		currentTransformMode,
		deleteFromScene,
		transformControls,
		addLightHelperToScene,
		monitor,
		selectObject,
		raycasterObjects,
		sceneChildren,
		objectVisibilityUpdate,
		updateScene
	}
})

if (import.meta.hot) {
	import.meta.hot.accept(acceptHMRUpdate(useThreeStore, import.meta.hot))
}
