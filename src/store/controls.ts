import { ViewportGizmo, type GizmoOptions } from 'three-viewport-gizmo'
import { acceptHMRUpdate, defineStore, storeToRefs } from 'pinia'
import { ref, shallowRef, triggerRef, watch } from 'vue'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { TransformControls, type TransformControlsMode } from 'three/examples/jsm/Addons.js'
import THREE from '@/three'
import { useComposerStore } from './composer'
import type { LightHelper } from '@/three/modules/light'
import { useThreeStore } from './three'
import { getUserData } from '@/three/utils'
import { useCameraStore } from './camera'
import { useAppStore } from './app'
import { MathUtils } from 'three'
import { useEventListener } from '@vueuse/core'

export const useControlsStore = defineStore('controls', () => {
	const controls = shallowRef<OrbitControls>()
	const gizmo = shallowRef<ViewportGizmo>()
	const transformControls = shallowRef<TransformControls>()
	const currentTransformMode = ref<TransformControlsMode>('translate')

	const isTransformDrag = ref(false)

	watch(currentTransformMode, (val) => {
		if (!transformControls.value) {
			console.warn('Cannot set transform mode: controls not initialized')
			return
		}
		transformControls.value.setMode(val)
	})

	const wasDragging = ref(false)

	function initControls(helperScene: THREE.Scene) {
		setTransformControls(helperScene)
		setOrbitControls()
	}

	function setOrbitControls() {
		const cameraStore = useCameraStore()
		const { activeCamera } = storeToRefs(cameraStore)
		const { rendererRef } = useComposerStore()

		if (!rendererRef) return console.warn('setOrbitControls: renderer is undefined')

		controls.value = new OrbitControls(activeCamera.value, rendererRef.domElement)
		controls.value.enablePan = true
		controls.value.screenSpacePanning = true
		controls.value.enableZoom = false
		controls.value.mouseButtons = {
			LEFT: null,
			MIDDLE: THREE.MOUSE.ROTATE,
			RIGHT: null
		}
		controls.value.touches = {
			ONE: THREE.TOUCH.ROTATE,
			TWO: THREE.TOUCH.PAN
		}

		gizmo.value = new ViewportGizmo(activeCamera.value, rendererRef, getGizmoConfig())
		gizmo.value.attachControls(controls.value)

		const { viewportCameras } = cameraStore

		watch(activeCamera, (newCamera) => {
			if (!controls.value || !gizmo.value) return
			gizmo.value.camera = newCamera

			if (
				newCamera.uuid !== viewportCameras.perspective.uuid &&
				newCamera.uuid !== viewportCameras.orthographic.uuid
			) {
				controls.value.enabled = false
			} else {
				controls.value.enabled = true
				controls.value.object = newCamera
			}
		})

		useEventListener(window, 'keydown', (e) => {
			switch (e.code) {
				case 'Numpad1': // Front / Back view
					e.preventDefault()
					setView({ z: 1, invert: e.ctrlKey })
					break
				case 'Numpad3': // Right / Left view
					e.preventDefault()
					setView({ x: 1, invert: e.ctrlKey })
					break
				case 'Numpad7': // Top / Bottom view
					e.preventDefault()
					setView({ y: 1, invert: e.ctrlKey })
					break
			}
		})
	}

	function setTransformControls(helperScene: THREE.Scene) {
		const cameraStore = useCameraStore()
		const { activeCamera } = storeToRefs(cameraStore)
		const { rendererRef } = useComposerStore()

		if (!rendererRef) return console.warn('setOrbitControls: renderer is undefined')

		transformControls.value = new TransformControls(activeCamera.value, rendererRef.domElement)
		transformControls.value.setMode(currentTransformMode.value)
		const transformHelper = transformControls.value.getHelper()
		transformHelper.name = 'TransformHelper'

		helperScene.add(transformHelper)

		watch(activeCamera, (newCamera) => {
			if (!transformControls.value) return
			transformControls.value.camera = newCamera
		})

		const { selectedObject } = storeToRefs(useThreeStore())
		const { isCtrlDown } = storeToRefs(useAppStore())

		watch(isCtrlDown, (newVal) => {
			if (newVal) {
				transformControls.value?.setTranslationSnap(1)
				transformControls.value?.setRotationSnap(MathUtils.degToRad(1))
				transformControls.value?.setScaleSnap(1)
			} else {
				transformControls.value?.setTranslationSnap(null)
				transformControls.value?.setRotationSnap(null)
				transformControls.value?.setScaleSnap(null)
			}
		})

		const stateBeforeDrag = {
			position: new THREE.Vector3(),
			quaternion: new THREE.Quaternion(),
			scale: new THREE.Vector3()
		}

		transformControls.value.addEventListener('objectChange', () => {
			triggerRef(selectedObject)
		})

		transformControls.value.addEventListener('dragging-changed', (e) => {
			if (e.value && transformControls.value) {
				const { position, quaternion, scale } = transformControls.value.object
				stateBeforeDrag.position.copy(position)
				stateBeforeDrag.quaternion.copy(quaternion)
				stateBeforeDrag.scale.copy(scale)
			}
			isTransformDrag.value = !!e.value
			wasDragging.value = !e.value
		})

		transformControls.value?.addEventListener('object-changed', (e) => {
			const { outlinePassRef } = useComposerStore()
			const { selectedObject } = storeToRefs(useThreeStore())

			const object = e.target.object as unknown as THREE.Object3D | LightHelper | undefined

			if (!object) {
				if (!outlinePassRef) return
				outlinePassRef.selectedObjects = []
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

		useEventListener(window, 'keydown', (e) => {
			if (!transformControls.value) return

			switch (e.code) {
				case 'KeyG':
					e.preventDefault()
					currentTransformMode.value = 'translate'
					break
				case 'KeyR':
					e.preventDefault()
					currentTransformMode.value = 'rotate'
					break
				case 'KeyS':
					e.preventDefault()
					currentTransformMode.value = 'scale'
					break
				case 'KeyZ':
					e.preventDefault()
					transformControls.value.axis = 'Z'
					break
				case 'KeyX':
					e.preventDefault()
					transformControls.value.axis = 'X'
					break
				case 'KeyY':
					e.preventDefault()
					transformControls.value.axis = 'Y'
					break
				case 'KeyC':
					e.preventDefault()
					transformControls.value.axis = 'XYZE'
					break
				case 'Escape': {
					e.preventDefault()
					if (!isTransformDrag.value) return
					const { position, quaternion, scale } = transformControls.value.object
					position.copy(stateBeforeDrag.position)
					quaternion.copy(stateBeforeDrag.quaternion)
					scale.copy(stateBeforeDrag.scale)
					transformControls.value.pointerUp(null)
					triggerRef(selectedObject)
					break
				}
			}
		})
	}

	function getGizmoConfig(): GizmoOptions {
		const rootStyle = getComputedStyle(document.documentElement)
		const colorX = rootStyle.getPropertyValue('--color-axis-x')
		const colorY = rootStyle.getPropertyValue('--color-axis-y')
		const colorZ = rootStyle.getPropertyValue('--color-axis-z')

		return {
			container: '.gizmo-wrapper',
			className: 'gizmo',
			size: 100,
			placement: 'top-right',
			lineWidth: 3,
			resolution: 128,
			x: {
				color: colorX,
				hover: {
					labelColor: '#fff',
					color: colorX
				}
			},
			y: {
				color: colorY,
				hover: {
					labelColor: '#fff',
					color: colorY
				}
			},
			z: {
				color: colorZ,
				hover: {
					labelColor: '#fff',
					color: colorZ
				}
			}
		}
	}

	function setView({
		x = 0,
		y = 0,
		z = 0,
		invert = false
	}: {
		x?: number
		y?: number
		z?: number
		invert?: boolean
	}) {
		const { activeCamera } = useCameraStore()
		const { controls } = useControlsStore()

		if (!controls || !activeCamera) return
		const dir = invert ? -1 : 1
		const distance = activeCamera.position.distanceTo(controls.target)
		const newPos = new THREE.Vector3(x * dir, y * dir, z * dir).multiplyScalar(distance)
		activeCamera.position.copy(controls.target).add(newPos)
		activeCamera.up.set(0, 1, 0)
		activeCamera.lookAt(controls.target)
		controls.update()
	}

	return {
		controls,
		gizmo,
		transformControls,
		initControls,
		currentTransformMode,
		wasDragging,
		isTransformDrag
	}
})

if (import.meta.hot) {
	import.meta.hot.accept(acceptHMRUpdate(useControlsStore, import.meta.hot))
}
