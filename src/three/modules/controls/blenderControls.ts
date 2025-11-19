import THREE from '@/three'
import { ViewportGizmo, type GizmoOptions } from 'three-viewport-gizmo'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { TransformControls } from 'three/examples/jsm/Addons.js'
import { watch, type Ref, type ShallowRef } from 'vue'

export function setupBlenderControls({
	cameraRef,
	controlsRef,
	gizmoRef,
	renderer,
	transformControlsRef,
	helperScene
}: BlenderControlsParameters) {
	controlsRef.value = new OrbitControls(cameraRef.value, renderer.domElement)
	transformControlsRef.value = new TransformControls(cameraRef.value, renderer.domElement)
	const transformHelper = transformControlsRef.value.getHelper()
	transformHelper.name = 'TransformHelper'

	// @ts-expect-error light/object type mismatch
	helperScene.add(transformHelper)

	controlsRef.value.enablePan = true
	controlsRef.value.screenSpacePanning = true
	controlsRef.value.enableZoom = false
	controlsRef.value.mouseButtons = {
		LEFT: null,
		MIDDLE: THREE.MOUSE.ROTATE,
		RIGHT: null
	}
	controlsRef.value.touches = {
		ONE: THREE.TOUCH.ROTATE,
		TWO: THREE.TOUCH.PAN
	}

	gizmoRef.value = new ViewportGizmo(cameraRef.value, renderer, getGizmoConfig())
	gizmoRef.value.attachControls(controlsRef.value)

	watch(cameraRef, (newCamera) => {
		if (!controlsRef.value || !gizmoRef.value) return
		controlsRef.value.object = newCamera
		gizmoRef.value.camera = newCamera
	})
}

function getGizmoConfig(): GizmoOptions {
	const rootStyle = getComputedStyle(document.documentElement)
	const colorX = rootStyle.getPropertyValue('--color-axis-x')
	const colorY = rootStyle.getPropertyValue('--color-axis-y')
	const coloyZ = rootStyle.getPropertyValue('--color-axis-z')

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
			color: coloyZ,
			hover: {
				labelColor: '#fff',
				color: coloyZ
			}
		}
	}
}

interface BlenderControlsParameters {
	cameraRef: Ref<THREE.PerspectiveCamera | THREE.OrthographicCamera>
	renderer: THREE.WebGLRenderer
	helperScene: THREE.Scene
	gizmoRef: ShallowRef<ViewportGizmo | undefined>
	controlsRef: ShallowRef<OrbitControls | undefined>
	transformControlsRef: ShallowRef<TransformControls | undefined>
}
