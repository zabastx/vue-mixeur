import { ViewportGizmo, type GizmoOptions } from 'three-viewport-gizmo'
import { acceptHMRUpdate, defineStore, storeToRefs } from 'pinia'
import { ref, shallowRef, watch, type Ref } from 'vue'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { TransformControls, type TransformControlsMode } from 'three/examples/jsm/Addons.js'
import THREE from '@/three'
import { useComposerStore } from './composer'
import type { LightHelper } from '@/three/modules/light'
import { useThreeStore } from './three'
import { getUserData } from '@/three/utils'

export const useControlsStore = defineStore('controls', () => {
	const controls = shallowRef<OrbitControls>()
	const gizmo = shallowRef<ViewportGizmo>()
	const transformControls = shallowRef<TransformControls>()
	const currentTransformMode = ref<TransformControlsMode>('translate')

	watch(currentTransformMode, (val) => {
		if (!transformControls.value) {
			console.warn('Cannot set transform mode: controls not initialized')
			return
		}
		transformControls.value.setMode(val)
	})

	const wasDragging = ref(false)

	function setupControls({
		cameraRef,
		helperScene
	}: {
		cameraRef: Ref<THREE.PerspectiveCamera | THREE.OrthographicCamera>
		helperScene: THREE.Scene
	}) {
		const { rendererRef } = useComposerStore()
		if (!rendererRef) return console.warn('setupControls: renderer is undefined')

		controls.value = new OrbitControls(cameraRef.value, rendererRef.domElement)
		transformControls.value = new TransformControls(cameraRef.value, rendererRef.domElement)
		transformControls.value.setMode(currentTransformMode.value)
		const transformHelper = transformControls.value.getHelper()
		transformHelper.name = 'TransformHelper'

		helperScene.add(transformHelper)

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

		gizmo.value = new ViewportGizmo(cameraRef.value, rendererRef, getGizmoConfig())
		gizmo.value.attachControls(controls.value)

		watch(cameraRef, (newCamera) => {
			if (!controls.value || !gizmo.value || !transformControls.value) return
			controls.value.object = newCamera
			gizmo.value.camera = newCamera
			transformControls.value.camera = newCamera
		})

		transformControls.value.addEventListener('dragging-changed', (e) => {
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

		return {
			controls,
			gizmo,
			transformControls
		}
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

	return {
		controls,
		gizmo,
		transformControls,
		setupControls,
		currentTransformMode,
		wasDragging
	}
})

if (import.meta.hot) {
	import.meta.hot.accept(acceptHMRUpdate(useControlsStore, import.meta.hot))
}
