import type { ViewportGizmo } from 'three-viewport-gizmo'
import { acceptHMRUpdate, defineStore } from 'pinia'
import { computed, ref, shallowRef, triggerRef, type ShallowRef } from 'vue'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import THREE, { enableBVH } from '@/three'
import { setGridHelper } from '@/three/modules/helpers/grid'
import { setupBlenderControls } from '@/three/modules/controls/blenderControls'
import { loadModel, type ModelLoaderParameters } from '@/three/modules/loaders/modelLoader'
import { setRaycaster } from '@/three/modules/core/raycaster'
import { useEventListener } from '@vueuse/core'
import { cameraSetup } from '@/three/modules/camera/setup'
import {
	OutlinePass,
	type TransformControls,
	type TransformControlsMode
} from 'three/examples/jsm/Addons.js'
import { disposeModel } from '@/three/modules/core/dispose'
import { createLight, getLightHelper, type LightHelper } from '@/three/modules/light'
import { useStats } from '@/three/modules/extras/stats'
import { useShadingStore } from './shading'
import { createMesh } from '@/three/modules/mesh'
import { exportModel } from '@/three/modules/addons/exporter'
import { useComposerStore } from './composer'

export const useThreeStore = defineStore('three', () => {
	const isInitiated = ref(false)
	const composerStore = useComposerStore()
	const shadingStore = useShadingStore()

	const scene = new THREE.Scene()
	const helperScene = new THREE.Scene()
	scene.background = new THREE.Color('#3D3D3D')

	const grid = setGridHelper(scene)

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
	function addGroup() {
		const group = new THREE.Group()
		group.name = 'Group'
		scene.add(group)
		return group
	}
	function moveToGroup(objUUID: string, groupUUID: string) {
		const group = scene.getObjectByProperty('uuid', groupUUID)
		const object = scene.getObjectByProperty('uuid', objUUID)
		if (!(group instanceof THREE.Group) || !object) return
		group.add(object)
	}

	const { activeCamera, switchCamera } = cameraSetup()
	const controls = shallowRef<OrbitControls>()
	const gizmo = shallowRef<ViewportGizmo>()

	const transformControls = shallowRef<TransformControls>()
	const currentTransformMode = ref<TransformControlsMode>('translate')

	function setTransformMode(mode: TransformControlsMode) {
		transformControls.value?.setMode(mode)
		currentTransformMode.value = mode
	}

	// ----------------------------------------
	const outlinePassRef = shallowRef<OutlinePass>()

	const { setFPSCounter, monitor, updateMonitor } = useStats()

	function addInitialObjects() {
		const pointLight = createLight({ type: 'point' })
		pointLight.power = 1000
		pointLight.position.set(4, 5, 1)
		addLightToScene(pointLight)

		const companionCube = createMesh('cube')
		addModelToScene(companionCube)
	}

	async function initScene(canvasRef: ShallowRef<HTMLCanvasElement | null>) {
		if (!canvasRef.value) return
		const canvas = canvasRef.value
		shadingStore.init(scene)

		if (import.meta.env.DEV) setFPSCounter(canvas.parentElement)

		if (!(activeCamera.value instanceof THREE.PerspectiveCamera)) return
		activeCamera.value.aspect = canvas.clientWidth / canvas.clientHeight

		const { composer, handleResize, outlinePass, renderer } = composerStore.init({
			camera: activeCamera,
			canvas,
			gizmo,
			scene
		})

		outlinePassRef.value = outlinePass

		setupBlenderControls({
			cameraRef: activeCamera,
			transformControlsRef: transformControls,
			controlsRef: controls,
			gizmoRef: gizmo,
			renderer,
			helperScene
		})

		// Raycasting
		const { pointer, raycaster } = setRaycaster(canvasRef)

		let wasDragging = false

		transformControls.value?.addEventListener('dragging-changed', (e) => {
			wasDragging = !e.value
		})

		useEventListener(canvasRef, 'click', () => {
			if (!outlinePassRef.value) return
			if (wasDragging) return (wasDragging = false)

			raycaster.setFromCamera(pointer, activeCamera.value)
			// @ts-ignore Three.js polymorphic this type issue
			const intersects = raycaster.intersectObjects(raycasterObjects, true)

			if (!intersects[0]) {
				outlinePassRef.value.selectedObjects = []
				transformControls.value?.detach()
				return
			}

			selectObject(intersects[0].object.uuid, true)
		})
		// -----------------------------

		addInitialObjects()

		const targetFPS = 30
		const frameDelay = 1000 / targetFPS
		let lastFrameTime = 0

		const clock = new THREE.Clock()
		renderer.setAnimationLoop(render)

		isInitiated.value = true

		function render(currentTime: number) {
			const deltaTime = currentTime - lastFrameTime
			if (deltaTime < frameDelay) return
			lastFrameTime = currentTime - (deltaTime % frameDelay)
			const delta = clock.getDelta()

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
		if (!uuid || !outlinePassRef.value) return

		const object = scene.getObjectByProperty('uuid', uuid)

		if (!object || (raycasted && !object.userData.isSelectable)) return

		if (object instanceof THREE.Light) {
			// @ts-ignore light/object type mismatch
			transformControls.value?.attach(object)
			selectedObject.value = object
			const helper = scene.getObjectByProperty('light', object)
			if (helper) {
				outlinePassRef.value.selectedObjects = [helper]
			}
			return
		}

		if ('light' in object) {
			const light = object.light as THREE.Light
			// @ts-ignore light/object type mismatch
			transformControls.value?.attach(light)
			outlinePassRef.value.selectedObjects = [object]
			selectedObject.value = light
			return
		}

		transformControls.value?.attach(object)
		outlinePassRef.value.selectedObjects = [object]
		selectedObject.value = object
	}

	transformControls.value?.addEventListener('objectChange', () => {
		triggerRef(selectedObject)
	})

	transformControls.value?.addEventListener('object-changed', (e) => {
		const object = e.target.object as unknown as THREE.Object3D | LightHelper | undefined
		if (!object) {
			if (!outlinePassRef.value) return
			outlinePassRef.value.selectedObjects = []
			return
		}

		if ('light' in object) {
			// @ts-ignore light/object type mismatch
			transformControls.value?.attach(object.light)
			selectedObject.value = object.light
			return
		}

		if (object.userData.skipRaycast && object.parent) {
			transformControls.value?.attach(object.parent)
			selectedObject.value = object.parent
		}
	})
	// -------------------------

	function addModelToScene(object: THREE.Object3D) {
		object.traverse((obj) => {
			obj.castShadow = true
			obj.receiveShadow = true
			obj.userData.isSelectable = true
			if (obj instanceof THREE.Mesh) {
				obj.userData.isShadable = true
				;(obj.material as THREE.Material).dithering = true
			}
			if (obj instanceof THREE.Light) {
				const helper = getLightHelper(obj)
				if (!helper) return

				object.add(helper)

				if (shadingStore.shadingMode !== 'rendered') {
					helper.light.visible = false
				}
			}
		})
		enableBVH(object)
		// @ts-ignore light/object type mismatch
		scene.add(object)
		raycasterObjects.push(object)

		shadingStore.cacheNewObjectMaterials(object)
		selectedObject.value = object
		transformControls.value?.attach(object)
		if (outlinePassRef.value) outlinePassRef.value.selectedObjects = [object]
	}

	function addLightToScene(light: THREE.Light) {
		const helper = getLightHelper(light)
		if (!helper) return

		helper.userData.isSelectable = true
		helper.userData.isSceneLight = true
		light.userData.isSelectable = true
		light.userData.isSceneLight = true

		if (!(light instanceof THREE.RectAreaLight)) {
			light.castShadow = true
		}
		// @ts-ignore light/object type mismatch
		scene.add(light)
		scene.add(helper)

		if (shadingStore.shadingMode !== 'rendered') {
			light.visible = false
		}

		raycasterObjects.push(helper)
		lightHelperObjects.push(helper)
		selectedObject.value = light
		// @ts-ignore light/object type mismatch
		transformControls.value?.attach(light)

		if (outlinePassRef.value) outlinePassRef.value.selectedObjects = [helper]
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
				// @ts-ignore light/object type mismatch
				scene.remove(obj)
				if (obj instanceof THREE.Light && obj.shadow.map) {
					obj.shadow.map.dispose()
				}
			})
		}

		if (selectedObject.value === object) {
			selectedObject.value = null
		}

		if (outlinePassRef.value) {
			outlinePassRef.value.selectedObjects = outlinePassRef.value.selectedObjects.filter(
				(selected) => selected !== object
			)
		}

		disposeModel(object)
		shadingStore.clearMaterialCache(object.uuid)

		const raycasterIdx = raycasterObjects.findIndex((obj) => obj.uuid === object.uuid)
		if (raycasterIdx >= 0) {
			raycasterObjects.splice(raycasterIdx, 1)
		}
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
		const model = await loadModel(params)
		if (!model) return

		const modelName = params.filename.split('.')[0] || 'Model'
		model.name = modelName
		addModelToScene(model)
	}
	// -----------------------------

	function objectVisibilityUpdate(uuid: string, val: boolean) {
		const obj = scene.getObjectByProperty('uuid', uuid)
		if (obj) {
			obj.visible = val
			triggerRef(sceneChildren)
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
		activeCamera,
		switchCamera,
		importModel,
		outlinePassRef,
		selectedObject,
		controls,
		addModelToScene,
		setTransformMode,
		currentTransformMode,
		deleteFromScene,
		transformControls,
		addLightToScene,
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
		isInitiated
	}
})

if (import.meta.hot) {
	import.meta.hot.accept(acceptHMRUpdate(useThreeStore, import.meta.hot))
}
