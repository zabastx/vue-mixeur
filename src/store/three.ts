import { acceptHMRUpdate, defineStore, storeToRefs } from 'pinia'
import { computed, ref, shallowRef, triggerRef, type ShallowRef } from 'vue'
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

	const scene = new THREE.Scene()
	const helperScene = new THREE.Scene()
	scene.background = new THREE.Color('#3D3D3D')

	const grid = setGridHelper(scene)

	const lightHelperObjects: LightHelper[] = []

	const sceneChildren = computed(() => scene.children)

	const sceneGroups = computed<THREE.Object3D[]>(() => {
		const groups: THREE.Object3D[] = []
		sceneChildren.value.forEach((item) => {
			item.traverse((obj) => {
				const isGroup = obj instanceof THREE.Group || obj instanceof THREE.Scene
				const userData = getUserData(obj)
				if (isGroup && !userData.hideInOutliner) groups.push(obj)
			})
		})
		return groups
	})

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

	function moveObjectToTarget(objUUID: string, targetUUID: string) {
		const target = scene.getObjectByProperty('uuid', targetUUID)
		const object = scene.getObjectByProperty('uuid', objUUID)
		if (!target || !object) return
		if (object.parent?.uuid === target.uuid) return
		target.add(object)
		updateScene()
	}

	function addObjectToScene(object: THREE.Object3D, parent?: THREE.Object3D | null) {
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

		if (parent) {
			parent.add(object)
			helpers.forEach((obj) => parent.add(obj))
		} else {
			scene.add(object)
			helpers.forEach((obj) => scene.add(obj))
		}

		cacheNewObjectMaterials(object)

		selectObject(object.uuid)
		updateScene()
	}

	function cloneObject(uuid: string) {
		const { getMaterialCache } = useShadingStore()
		const object = scene.getObjectByProperty('uuid', uuid)
		if (!object) return console.warn('cloneObject: object is undefined')
		const newObj = object.clone()
		newObj.userData.mixeur = getUserData(object)
		if (object instanceof THREE.Mesh && newObj instanceof THREE.Mesh) {
			newObj.material = getMaterialCache(object)?.original
		}
		addObjectToScene(newObj, object.parent)
	}

	function deleteFromScene(uuid: string) {
		const { transformControls } = useControlsStore()
		const { removeFromRaycaster } = useRaycastStore()
		const { clearMaterialCache } = useShadingStore()
		const { removeFromOutline } = useComposerStore()

		transformControls?.detach()
		const object = scene.getObjectByProperty('uuid', uuid)

		if (!object) return console.warn('deleteFromScene: object is undefined')

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

	// Object selection
	const selectedObject = shallowRef<THREE.Object3D | THREE.Light | THREE.Mesh | null>(null)

	function selectObject(uuid?: string, raycasted?: boolean) {
		const { transformControls } = useControlsStore()
		const { setOutlineObjects } = useComposerStore()

		if (!uuid) return

		const object = scene.getObjectByProperty('uuid', uuid)

		if (!object || (raycasted && !getUserData(object).isSelectable)) return

		if (object instanceof THREE.Light) {
			transformControls?.attach(object)
			selectedObject.value = object
			const helper = scene.getObjectByProperty('light', object)
			if (helper) {
				setOutlineObjects([helper])
			}
			return
		}

		if (object instanceof THREE.Camera) {
			transformControls?.attach(object)
			selectedObject.value = object
			const helper = scene.getObjectByProperty('camera', object)
			if (helper) {
				setOutlineObjects([helper])
			}
			return
		}

		if ('light' in object) {
			const light = object.light as THREE.Light
			transformControls?.attach(light)
			setOutlineObjects([object])
			selectedObject.value = light
			return
		}

		if ('camera' in object) {
			const camera = object.camera as THREE.Camera
			transformControls?.attach(camera)
			setOutlineObjects([object])
			selectedObject.value = camera
			return
		}

		transformControls?.attach(object)
		setOutlineObjects([object])
		selectedObject.value = object
	}
	// -------------------------

	const { setFPSCounter, monitor, updateMonitor } = useStats()

	function initScene(canvasRef: ShallowRef<HTMLCanvasElement | null>) {
		if (!canvasRef.value) return

		const shadingStore = useShadingStore()
		const { initTheme } = usePreferencesStore()
		const controlsStore = useControlsStore()
		const composerStore = useComposerStore()
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

	return {
		initScene,
		selectedObject,
		addObjectToScene,
		cloneObject,
		deleteFromScene,
		monitor,
		selectObject,
		sceneChildren,
		objectVisibilityUpdate,
		updateScene,
		exportScene,
		scene,
		addGroup,
		moveObjectToTarget,
		isInitiated,
		sceneGroups
	}
})

if (import.meta.hot) {
	import.meta.hot.accept(acceptHMRUpdate(useThreeStore, import.meta.hot))
}
