import THREE from '@/three'

export function createCamera<T extends CameraOptions>(options: T): CameraReturnType<T> {
	const { far, near } = options
	if (options.type === 'Perspective') {
		const { aspect, fov } = options
		return new THREE.PerspectiveCamera(fov, aspect, near, far) as CameraReturnType<T>
	}
	const { left, right, bottom, top } = options
	return new THREE.OrthographicCamera(left, right, top, bottom, near, far) as CameraReturnType<T>
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
