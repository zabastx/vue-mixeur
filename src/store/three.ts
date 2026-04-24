import { acceptHMRUpdate, defineStore, storeToRefs } from 'pinia'
import { computed, ref, triggerRef, type ShallowRef } from 'vue'
import THREE from '@/three'
import { setGridHelper } from '@/three/modules/helpers/grid'
import { RectAreaLightUniformsLib } from 'three/examples/jsm/Addons.js'
import { disposeModel } from '@/three/modules/core/dispose'
import { getLightHelper, type LightHelper } from '@/three/modules/light'
import { useStats } from '@/three/modules/extras/stats'
import { useShadingStore } from './shading'
import { exportModel } from '@/three/modules/addons/exporter'
import { useComposerStore } from './composer'
import { getUserData, enableBVH } from '@/three/utils'
import { useCameraStore } from './camera'
import { useRaycastStore } from './raycast'
import { usePreferencesStore } from './preferences'
import { useControlsStore } from './controls'

export const useThreeStore = defineStore('three', () => {
	const isInitiated = ref(false)
	const composerStore = useComposerStore()

	const scene = new THREE.Scene()
	const helperScene = new THREE.Scene()
	scene.background = new THREE.Color('#3D3D3D')

	const grid = setGridHelper(scene)

	const lightHelperObjects: LightHelper[] = []

	const sceneChildren = computed(() => scene.children)

	function updateScene() {
		triggerRef(sceneChildren)
	}

	function addGroup() {
		const group = new THREE.Group()
		group.name = 'Group'
		const userData = getUserData(group)
		userData.userVisible = group.visible
		group.castShadow = true
		group.receiveShadow = true
		scene.add(group)
		updateScene()
		return group
	}

	function moveToGroup(objUUID: string, groupUUID: string) {
		const group = scene.getObjectByProperty('uuid', groupUUID)
		const object = scene.getObjectByProperty('uuid', objUUID)
		if (!(group instanceof THREE.Group) || !object) return
		group.add(object)
		updateScene()
	}

	// ----------------------------------------

	const { setFPSCounter, monitor, updateMonitor } = useStats()

	function initScene(canvasRef: ShallowRef<HTMLCanvasElement | null>) {
		if (!canvasRef.value) return

		const shadingStore = useShadingStore()
		const { initTheme } = usePreferencesStore()
		const controlsStore = useControlsStore()
		const { gizmo, controls } = storeToRefs(controlsStore)

		initTheme()

		const canvas = canvasRef.value

		shadingStore.init()
		RectAreaLightUniformsLib.init()

		if (import.meta.env.DEV) setFPSCounter(canvas.parentElement)

		const { activeCamera } = storeToRefs(useCameraStore())

		if (!(activeCamera.value instanceof THREE.PerspectiveCamera)) return
		activeCamera.value.aspect = canvas.clientWidth / canvas.clientHeight

		const { composer, handleResize, renderer } = composerStore.init({
			camera: activeCamera,
			canvas,
			gizmo,
			scene
		})

		controlsStore.setupControls({
			cameraRef: activeCamera,
			helperScene
		})

		const raycastStore = useRaycastStore()
		raycastStore.init(canvasRef)

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
		const { transformControls } = useControlsStore()
		const { outlinePassRef } = useComposerStore()

		if (!uuid || !outlinePassRef) return console.warn('selectObject: outlinePassRef is undefined')

		const object = scene.getObjectByProperty('uuid', uuid)

		if (!object || (raycasted && !getUserData(object).isSelectable)) return

		if (object instanceof THREE.Light) {
			transformControls?.attach(object)
			selectedObject.value = object
			const helper = scene.getObjectByProperty('light', object)
			if (helper) {
				outlinePassRef.selectedObjects = [helper]
			}
			return
		}

		if (object instanceof THREE.Camera) {
			transformControls?.attach(object)
			selectedObject.value = object
			const helper = scene.getObjectByProperty('camera', object)
			if (helper) {
				outlinePassRef.selectedObjects = [helper]
			}
			return
		}

		if ('light' in object) {
			const light = object.light as THREE.Light
			transformControls?.attach(light)
			outlinePassRef.selectedObjects = [object]
			selectedObject.value = light
			return
		}

		if ('camera' in object) {
			const camera = object.camera as THREE.Camera
			transformControls?.attach(camera)
			outlinePassRef.selectedObjects = [object]
			selectedObject.value = camera
			return
		}

		transformControls?.attach(object)
		outlinePassRef.selectedObjects = [object]
		selectedObject.value = object
	}
	// -------------------------

	function addObjectToScene(object: THREE.Object3D) {
		const helpers: THREE.Object3D[] = []
		const { addToRaycaster } = useRaycastStore()
		const { shadingMode, cacheNewObjectMaterials } = useShadingStore()

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

				if (shadingMode !== 'rendered') {
					helper.light.visible = false
				}

				helpers.push(helper)
				lightHelperObjects.push(helper)
				addToRaycaster(helper)
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
				addToRaycaster(helper)
				return
			}

			userData.isSelectable = true
			addToRaycaster(obj)
		})

		enableBVH(object)

		scene.add(object)
		helpers.forEach((obj) => scene.add(obj))

		cacheNewObjectMaterials(object)

		selectObject(object.uuid)
		updateScene()
	}

	function deleteFromScene(object: THREE.Object3D) {
		const { transformControls } = useControlsStore()
		const { removeFromRaycaster } = useRaycastStore()
		const { clearMaterialCache } = useShadingStore()

		transformControls?.detach()

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
		clearMaterialCache(object.uuid)
		updateScene()
	}

	function removeFromOutline(uuid: string) {
		const { outlinePassRef } = useComposerStore()
		if (!outlinePassRef) return
		const idx = outlinePassRef.selectedObjects.findIndex((obj) => obj.uuid === uuid)
		if (idx >= 0) {
			outlinePassRef.selectedObjects.splice(idx, 1)
		}
	}

	function objectVisibilityUpdate(uuid: string, val: boolean) {
		const { shadingMode } = useShadingStore()
		const obj = scene.getObjectByProperty('uuid', uuid)

		if (obj) {
			const userData = getUserData(obj)
			userData.userVisible = val
			if (userData.helperUUID) objectVisibilityUpdate(userData.helperUUID, val)
			if (!userData.hideInModes?.includes(shadingMode)) {
				obj.visible = val
			}
			updateScene()
		}
	}

	function exportScene() {
		const { shadingMode, setMode } = useShadingStore()
		const mode = shadingMode
		setMode('export')
		exportModel(scene)
		setMode(mode)
	}

	return {
		initScene,
		selectedObject,
		addObjectToScene,
		deleteFromScene,
		monitor,
		selectObject,
		sceneChildren,
		objectVisibilityUpdate,
		updateScene,
		exportScene,
		scene,
		addGroup,
		moveToGroup,
		isInitiated
	}
})

if (import.meta.hot) {
	import.meta.hot.accept(acceptHMRUpdate(useThreeStore, import.meta.hot))
}
