import * as THREE from 'three'
import { ViewportGizmo, type GizmoOptions } from 'three-viewport-gizmo'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

export function setupBlenderControls(
	camera: THREE.PerspectiveCamera | THREE.OrthographicCamera,
	renderer: THREE.WebGLRenderer
) {
	const controls = new OrbitControls(camera, renderer.domElement)

	// controls.enableDamping = true
	// controls.dampingFactor = 0.1
	controls.screenSpacePanning = false
	controls.enablePan = true
	controls.mouseButtons = {
		LEFT: null,
		MIDDLE: THREE.MOUSE.ROTATE,
		RIGHT: null
	}
	controls.touches = {
		ONE: THREE.TOUCH.ROTATE,
		TWO: THREE.TOUCH.PAN
	}

	const gizmo = new ViewportGizmo(camera, renderer, getGizmoConfig())
	gizmo.attachControls(controls)

	gizmo.target.set(0, 0, 0)
	camera.lookAt(gizmo.target)

	return { gizmo, orbitControls: controls }
}

function getGizmoConfig(): GizmoOptions {
	return {
		container: '.canvas-wrapper',
		className: 'gizmo',
		size: 100
	}
}
