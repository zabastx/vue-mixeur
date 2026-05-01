import { acceptHMRUpdate, defineStore } from 'pinia'
import { computed, shallowRef, triggerRef } from 'vue'
import THREE from '@/shared/three'
import { setGridHelper } from '@/shared/three/modules/helpers/grid'
import { disposeModel } from '@/shared/three/modules/core/dispose'
import { getLightHelper, lightHasShadow, type LightHelper } from '@/shared/three/modules/light'
import { exportModel } from '@/shared/three/modules/addons/exporter'
import { getUserData, enableBVH } from '@/shared/three/utils'
import { useShadingStore } from './shading'
import { useRaycastStore } from './raycast'
import { useControlsStore } from './controls'
import { useComposerStore } from './composer'
import { useCameraStore } from './camera'
import { useThreeStore } from './three'

export const useSceneStore = defineStore('scene', () => {
	const scene = shallowRef(new THREE.Scene())
	const helperScene = shallowRef(new THREE.Scene())
	scene.value.background = new THREE.Color('#3D3D3D')

	const grid = setGridHelper(scene.value)

	const lightHelperObjects: LightHelper[] = []

	const sceneChildren = computed(() => scene.value.children)

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
		scene.value.add(group)
		updateScene()
		return group
	}

	function moveObjectToTarget(objUUID: string, targetUUID: string) {
		const target = scene.value.getObjectByProperty('uuid', targetUUID)
		const object = scene.value.getObjectByProperty('uuid', objUUID)
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

			if ('material' in obj) {
				userData.isShadable = true
				const material = obj.material as THREE.Material | THREE.Material[]
				if (Array.isArray(material)) material.forEach((mat) => (mat.dithering = true))
				else material.dithering = true

				obj.castShadow = true
				obj.receiveShadow = true
			}

			if (obj instanceof THREE.Light) {
				const helper = getLightHelper(obj)
				userData.hideInModes = ['wireframe', 'solid', 'preview']
				userData.isSceneLight = true

				if (lightHasShadow(obj)) {
					obj.castShadow = true
				}

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
			scene.value.add(object)
			helpers.forEach((obj) => scene.value.add(obj))
		}

		cacheNewObjectMaterials(object)

		const threeStore = useThreeStore()
		threeStore.selectObject(object.uuid)
		updateScene()
	}

	function cloneObject(uuid: string) {
		const { getMaterialCache } = useShadingStore()
		const object = scene.value.getObjectByProperty('uuid', uuid)
		if (!object) return console.warn('cloneObject: object is undefined')
		const newObj = object.clone()
		newObj.userData.mixeur = structuredClone(getUserData(object))
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
		const object = scene.value.getObjectByProperty('uuid', uuid)

		if (!object) return console.warn('deleteFromScene: object is undefined')

		const helperUUID = getUserData(object).helperUUID
		if (helperUUID) {
			const helper = scene.value.getObjectByProperty('uuid', helperUUID)
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

		removeFromOutline(object.uuid)
		removeFromRaycaster(object.uuid)

		disposeModel(object)
		clearMaterialCache(object.uuid)
		updateScene()
	}

	function objectVisibilityUpdate(uuid: string, val: boolean) {
		const { shadingMode } = useShadingStore()
		const obj = scene.value.getObjectByProperty('uuid', uuid)

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
		exportModel(scene.value)
		setMode(mode)
	}

	return {
		scene,
		helperScene,
		sceneChildren,
		sceneGroups,
		grid,
		lightHelperObjects,
		updateScene,
		addGroup,
		moveObjectToTarget,
		addObjectToScene,
		cloneObject,
		deleteFromScene,
		objectVisibilityUpdate,
		exportScene
	}
})

if (import.meta.hot) {
	import.meta.hot.accept(acceptHMRUpdate(useSceneStore, import.meta.hot))
}
