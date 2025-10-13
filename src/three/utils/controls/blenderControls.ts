import THREE from '@/three'
import { ViewportGizmo, type GizmoOptions } from 'three-viewport-gizmo'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { TransformControls } from 'three/examples/jsm/Addons.js'

export function setupBlenderControls(
	camera: THREE.PerspectiveCamera | THREE.OrthographicCamera,
	renderer: THREE.WebGLRenderer
) {
	const controls = new OrbitControls(camera, renderer.domElement)
	const transformControls = new TransformControls(camera, renderer.domElement)

	controls.enablePan = true
	controls.screenSpacePanning = true
	controls.enableZoom = false
	controls.mouseButtons = {
		LEFT: null,
		MIDDLE: THREE.MOUSE.ROTATE,
		RIGHT: null
	}
	controls.touches = {
		ONE: THREE.TOUCH.ROTATE,
		TWO: THREE.TOUCH.PAN
	}

	const gizmoConfig: GizmoOptions = {
		container: '.canvas-wrapper',
		className: 'gizmo',
		size: 100,
		animated: true,
		placement: 'top-right'
	}

	const gizmo = new ViewportGizmo(camera, renderer, gizmoConfig)
	gizmo.attachControls(controls)

	return { gizmo, controls, transformControls }
}
