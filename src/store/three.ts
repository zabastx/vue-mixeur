import { acceptHMRUpdate, defineStore, storeToRefs } from 'pinia'
import { computed, ref, shallowRef, triggerRef, type ShallowRef } from 'vue'
import THREE from '@/three'
import { setGridHelper } from '@/three/modules/helpers/grid'
import { useControlsStore } from './controls'
import { setRaycaster } from '@/three/modules/core/raycaster'
import { useEventListener } from '@vueuse/core'
import { OutlinePass, RectAreaLightUniformsLib } from 'three/examples/jsm/Addons.js'
import { disposeModel } from '@/three/modules/core/dispose'
import { getLightHelper, type LightHelper } from '@/three/modules/light'
import { useStats } from '@/three/modules/extras/stats'
import { useShadingStore } from './shading'
import { exportModel } from '@/three/modules/addons/exporter'
import { useComposerStore } from './composer'
import { getUserData, enableBVH } from '@/three/utils'
import { useCameraStore } from './camera'
import { emitCustomEvent, listenCustomEvent } from '@/utils/events'

export const useThreeStore = defineStore('three', () => {
	const isInitiated = ref(false)
	const composerStore = useComposerStore()
	const shadingStore = useShadingStore()
	const controlsStore = useControlsStore()

	const scene = new THREE.Scene()
	const helperScene = new THREE.Scene()
	scene.background = new THREE.Color('#3D3D3D')

	const grid = setGridHelper(scene)

	const raycasterObjects: THREE.Object3D[] = []
	const lightHelperObjects: LightHelper[] = []

	const sceneChildren = computed(() => scene.children)

	function updateScene() {
		triggerRef(sceneChildren)
	}

	const customEvents = [
		listenCustomEvent('shading:modeChange', updateScene),
		listenCustomEvent('scene:objectDeleted', updateScene),
		listenCustomEvent('scene:objectAdded', updateScene)
	]

	function disposeEvents() {
		customEvents.forEach((cleanup) => cleanup())
	}

	function addGroup() {
		const group = new THREE.Group()
		group.name = 'Group'
		addObjectToScene(group)
		return group
	}
	function moveToGroup(objUUID: string, groupUUID: string) {
		const group = scene.getObjectByProperty('uuid', groupUUID)
		const object = scene.getObjectByProperty('uuid', objUUID)
		if (!(group instanceof THREE.Group) || !object) return
		group.add(object)
	}

	const { controls, gizmo, transformControls } = storeToRefs(controlsStore)

	// ----------------------------------------
	const outlinePassRef = shallowRef<OutlinePass>()

	const { setFPSCounter, monitor, updateMonitor } = useStats()

	function initScene(canvasRef: ShallowRef<HTMLCanvasElement | null>) {
		if (!canvasRef.value) return
		const canvas = canvasRef.value
		shadingStore.init()
		RectAreaLightUniformsLib.init()

		if (import.meta.env.DEV) setFPSCounter(canvas.parentElement)

		const { activeCamera } = storeToRefs(useCameraStore())

		if (!(activeCamera.value instanceof THREE.PerspectiveCamera)) return
		activeCamera.value.aspect = canvas.clientWidth / canvas.clientHeight

		const { composer, handleResize, outlinePass, renderer } = composerStore.init({
			camera: activeCamera,
			canvas,
			gizmo,
			scene
		})

		outlinePassRef.value = outlinePass

		controlsStore.setupControls({
			cameraRef: activeCamera,
			renderer,
			helperScene
		})

		setupTransformControlsListener()

		// Raycasting
		const { pointer, raycaster } = setRaycaster(canvasRef)

		useEventListener(canvasRef, 'click', () => {
			if (!outlinePassRef.value) return
			if (controlsStore.wasDragging) return (controlsStore.wasDragging = false)

			raycaster.setFromCamera(pointer, activeCamera.value)
			const intersects = raycaster.intersectObjects(raycasterObjects, true)

			if (!intersects[0]) {
				outlinePassRef.value.selectedObjects = []
				transformControls.value?.detach()
				return
			}

			selectObject(intersects[0].object.uuid, true)
		})
		// -----------------------------

		const targetFPS = 30
		const frameDelay = 1000 / targetFPS
		let lastFrameTime = 0

		const timer = new THREE.Timer()
		renderer.setAnimationLoop(render)

		isInitiated.value = true

		function render(currentTime: number) {
			const deltaTime = currentTime - lastFrameTime
			if (deltaTime < frameDelay) return
			lastFrameTime = currentTime - (deltaTime % frameDelay)
			timer.update()
			const delta = timer.getDelta()

			handleResize()

			grid.update(activeCamera.value)
			controls.value?.update(delta)
			lightHelperObjects.forEach((item) => {
				if ('update' in item) item.update()
			})
			composer.render(delta)
			gizmo.value?.render()
			renderer.clearDepth()
			renderer.render(helperScene, activeCamera.value)

			updateMonitor(renderer)
		}
	}

	// Object selection
	const selectedObject = ref<THREE.Object3D | THREE.Light | THREE.Mesh | null>(null)

	function selectObject(uuid?: string, raycasted?: boolean) {
		if (!uuid || !outlinePassRef.value)
			return console.warn('selectObject: outlinePassRef is undefined')

		const object = scene.getObjectByProperty('uuid', uuid)

		if (!object || (raycasted && !getUserData(object).isSelectable)) return

		if (object instanceof THREE.Light) {
			transformControls.value?.attach(object)
			selectedObject.value = object
			const helper = scene.getObjectByProperty('light', object)
			if (helper) {
				outlinePassRef.value.selectedObjects = [helper]
			}
			return
		}

		if (object instanceof THREE.Camera) {
			transformControls.value?.attach(object)
			selectedObject.value = object
			const helper = scene.getObjectByProperty('camera', object)
			if (helper) {
				outlinePassRef.value.selectedObjects = [helper]
			}
			return
		}

		if ('light' in object) {
			const light = object.light as THREE.Light
			transformControls.value?.attach(light)
			outlinePassRef.value.selectedObjects = [object]
			selectedObject.value = light
			return
		}

		if ('camera' in object) {
			const camera = object.camera as THREE.Camera
			transformControls.value?.attach(camera)
			outlinePassRef.value.selectedObjects = [object]
			selectedObject.value = camera
			return
		}

		transformControls.value?.attach(object)
		outlinePassRef.value.selectedObjects = [object]
		selectedObject.value = object
	}

	function setupTransformControlsListener() {
		if (!transformControls.value) return

		transformControls.value.addEventListener('objectChange', () => {
			triggerRef(selectedObject)
		})

		transformControls.value.addEventListener('object-changed', (e) => {
			const object = e.target.object as unknown as THREE.Object3D | LightHelper | undefined
			if (!object) {
				if (!outlinePassRef.value) return
				outlinePassRef.value.selectedObjects = []
				return
			}

			if ('light' in object) {
				transformControls.value?.attach(object.light)
				selectedObject.value = object.light
				return
			}

			if (getUserData(object).skipRaycast && object.parent) {
				transformControls.value?.attach(object.parent)
				selectedObject.value = object.parent
			}
		})
	}

	// -------------------------

	function addObjectToScene(object: THREE.Object3D) {
		const helpers: THREE.Object3D[] = []
		object.traverse((obj) => {
			const userData = getUserData(obj)
			userData.userVisible = obj.visible
			obj.castShadow = true
			obj.receiveShadow = true

			if ('material' in obj) {
				userData.isShadable = true
				const material = obj.material as THREE.Material | THREE.Material[]
				if (Array.isArray(material)) material.forEach((mat) => (mat.dithering = true))
				else material.dithering = true
			}

			if (obj instanceof THREE.Light) {
				const helper = getLightHelper(obj)
				userData.hideInModes = ['wireframe', 'solid', 'preview']
				userData.isSceneLight = true

				if (!helper) return

				if (shadingStore.shadingMode !== 'rendered') {
					helper.light.visible = false
				}

				helpers.push(helper)
				lightHelperObjects.push(helper)
				raycasterObjects.push(helper)
				return
			}

			if (obj instanceof THREE.Camera) {
				const helper = new THREE.CameraHelper(obj)

				helper.name = `${obj.name} Helper`

				const helperUserData = getUserData(helper)

				helperUserData.isSelectable = true
				helperUserData.isHelper = true
				helperUserData.hideInOutliner = true

				userData.helperUUID = helper.uuid
				userData.isRenderCamera = true

				helpers.push(helper)
				raycasterObjects.push(helper)
				return
			}

			userData.isSelectable = true
			raycasterObjects.push(obj)
		})

		enableBVH(object)

		scene.add(object)
		helpers.forEach((obj) => scene.add(obj))

		shadingStore.cacheNewObjectMaterials(object)

		selectObject(object.uuid)
		emitCustomEvent('scene:objectAdded', object)
	}

	function deleteFromScene(object: THREE.Object3D) {
		transformControls.value?.detach()

		const helperUUID = getUserData(object).helperUUID
		if (helperUUID) {
			const helper = scene.getObjectByProperty('uuid', helperUUID)
			if (helper) {
				removeFromOutline(helper.uuid)
				removeFromRaycaster(helper.uuid)
				disposeModel(helper)
			}
		}

		const cameraStore = useCameraStore()
		if (cameraStore.renderCamera?.uuid === object.uuid) {
			cameraStore.renderCamera = null
		}

		if (selectedObject.value === object) {
			selectedObject.value = null
		}

		removeFromOutline(object.uuid)
		removeFromRaycaster(object.uuid)

		disposeModel(object)
		shadingStore.clearMaterialCache(object.uuid)
		emitCustomEvent('scene:objectDeleted', null)
	}

	function removeFromRaycaster(uuid: string) {
		const idx = raycasterObjects.findIndex((obj) => obj.uuid === uuid)
		if (idx >= 0) {
			raycasterObjects.splice(idx, 1)
		}
	}

	function removeFromOutline(uuid: string) {
		if (!outlinePassRef.value) return
		const idx = outlinePassRef.value.selectedObjects.findIndex((obj) => obj.uuid === uuid)
		if (idx >= 0) {
			outlinePassRef.value.selectedObjects.splice(idx, 1)
		}
	}

	function objectVisibilityUpdate(uuid: string, val: boolean) {
		const obj = scene.getObjectByProperty('uuid', uuid)
		if (obj) {
			const userData = getUserData(obj)
			userData.userVisible = val
			if (userData.helperUUID) objectVisibilityUpdate(userData.helperUUID, val)
			if (!userData.hideInModes?.includes(shadingStore.shadingMode)) {
				obj.visible = val
			}
			updateScene()
		}
	}

	function exportScene() {
		const mode = shadingStore.shadingMode
		shadingStore.setMode('export')
		exportModel(scene)
		shadingStore.setMode(mode)
	}

	return {
		initScene,
		outlinePassRef,
		selectedObject,
		controls,
		addObjectToScene,
		deleteFromScene,
		transformControls,
		monitor,
		selectObject,
		raycasterObjects,
		sceneChildren,
		objectVisibilityUpdate,
		updateScene,
		exportScene,
		scene,
		addGroup,
		moveToGroup,
		isInitiated,
		disposeEvents
	}
})

if (import.meta.hot) {
	import.meta.hot.accept(acceptHMRUpdate(useThreeStore, import.meta.hot))
	import.meta.hot.dispose(() => useThreeStore().disposeEvents())
}
