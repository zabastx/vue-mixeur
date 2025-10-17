import THREE from '@/three'

/**
 * Creates WebGLRenderer with settings similar to Blender Eevee (Filmic)
 * @param canvas HTMLCanvasElement
 */
export function createBlenderRenderer({
	canvas
}: {
	canvas: HTMLCanvasElement
	// hdriPath?: string
	// scene: THREE.Scene
}) {
	const renderer = new THREE.WebGLRenderer({
		canvas,
		// antialias: true,
		alpha: true,
		precision: 'highp',
		powerPreference: 'high-performance'
	})

	const { clientWidth, clientHeight } = canvas

	renderer.setPixelRatio(window.devicePixelRatio)
	renderer.setSize(clientWidth, clientHeight, false)

	renderer.toneMapping = THREE.ACESFilmicToneMapping
	renderer.outputColorSpace = THREE.SRGBColorSpace
	renderer.toneMappingExposure = 1.0
	renderer.shadowMap.enabled = true
	renderer.shadowMap.type = THREE.PCFSoftShadowMap

	// HDRI evnironment
	// if (hdriPath) {
	// 	const hdrEquirect = await new RGBELoader().loadAsync(hdriPath)
	// 	hdrEquirect.mapping = THREE.EquirectangularReflectionMapping
	// 	scene.environment = hdrEquirect
	// 	scene.background = hdrEquirect
	// }

	return renderer
}
