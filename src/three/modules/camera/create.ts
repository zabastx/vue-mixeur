import THREE from '@/three'

export function createCamera<T extends CameraOptions>(options: T): CameraReturnType<T> {
	const { far, near } = options
	if (options.type === 'Perspective') {
		const { aspect, fov } = options
		const camera = new THREE.PerspectiveCamera(fov, aspect, near, far)
		camera.name = options.name || camera.type
		return camera as CameraReturnType<T>
	}
	const { left, right, bottom, top } = options
	const camera = new THREE.OrthographicCamera(left, right, top, bottom, near, far)
	camera.name = options.name || camera.type
	return camera as CameraReturnType<T>
}

interface CameraConstructorOptions {
	near?: number
	far?: number
	name?: string
}

interface PerspectiveCameraOptions extends CameraConstructorOptions {
	type: 'Perspective'
	aspect?: number
	fov?: number
}

interface OrthographicCameraOptions extends CameraConstructorOptions {
	type: 'Orthographic'
	left?: number
	right?: number
	top?: number
	bottom?: number
}

type CameraOptions = PerspectiveCameraOptions | OrthographicCameraOptions

type CameraReturnType<T extends CameraOptions> = T['type'] extends 'Perspective'
	? THREE.PerspectiveCamera
	: THREE.OrthographicCamera
