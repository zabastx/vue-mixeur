import THREE from '@/three'
import { initPMREMGenerator } from '../extras/pmremGenerator'

/**
 * Creates WebGLRenderer with settings similar to Blender Eevee (Filmic)
 * @param canvas HTMLCanvasElement
 */
export function createBlenderRenderer({ canvas }: { canvas: HTMLCanvasElement }) {
	const renderer = new THREE.WebGLRenderer({
		canvas,
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
	renderer.autoClear = false

	initPMREMGenerator(renderer)

	return renderer
}
