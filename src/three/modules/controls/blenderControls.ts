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

	const gizmoConfig: GizmoOptions = {
		container: '.gizmo-wrapper',
		className: 'gizmo',
		size: 100,
		animated: true,
		placement: 'top-right'
	}

	gizmoRef.value = new ViewportGizmo(cameraRef.value, renderer, gizmoConfig)
	gizmoRef.value.attachControls(controlsRef.value)

	watch(cameraRef, (newCamera) => {
		if (!controlsRef.value || !gizmoRef.value) return
		controlsRef.value.object = newCamera
		gizmoRef.value.camera = newCamera
	})
}

interface BlenderControlsParameters {
	cameraRef: Ref<THREE.PerspectiveCamera | THREE.OrthographicCamera>
	renderer: THREE.WebGLRenderer
	helperScene: THREE.Scene
	gizmoRef: ShallowRef<ViewportGizmo | undefined>
	controlsRef: ShallowRef<OrbitControls | undefined>
	transformControlsRef: ShallowRef<TransformControls | undefined>
}
