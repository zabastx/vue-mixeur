import { shallowRef } from 'vue'
import { createCamera } from './create'
import THREE from '@/three'

export function cameraSetup() {
	const perspectiveCamera = createCamera({
		type: 'Perspective',
		fov: 39.6,
		near: 0.1,
		far: 10000,
		name: 'Default Perspective Camera'
	})

	const orthographicCamera = createCamera({
		type: 'Orthographic',
		near: -10000,
		far: 10000,
		name: 'Default Orthographic Camera'
	})

	const activeCamera = shallowRef<THREE.PerspectiveCamera | THREE.OrthographicCamera>(
		perspectiveCamera
	)

	activeCamera.value.position.set(4, 4, 4)
	activeCamera.value.lookAt(0, 0, 0)

	/**
	 * Switches the active camera between a PerspectiveCamera and an OrthographicCamera,
	 * preserving the current position, rotation, scale, and key projection parameters.
	 */
	function switchCamera(): void {
		if (activeCamera.value instanceof THREE.PerspectiveCamera) {
			orthographicCamera.position.copy(activeCamera.value.position)
			orthographicCamera.quaternion.copy(activeCamera.value.quaternion)
			orthographicCamera.scale.copy(activeCamera.value.scale)
			activeCamera.value = orthographicCamera
		} else {
			perspectiveCamera.position.copy(activeCamera.value.position)
			perspectiveCamera.quaternion.copy(activeCamera.value.quaternion)
			perspectiveCamera.scale.copy(activeCamera.value.scale)
			activeCamera.value = perspectiveCamera
		}
		activeCamera.value.updateProjectionMatrix()
	}

	return { perspectiveCamera, orthographicCamera, activeCamera, switchCamera }
}
