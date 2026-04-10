import THREE from '@/three'
import { loadEXR } from './exr'
import { pmremGenerator } from '../extras/pmremGenerator'

/**
 * Loads a world texture (EXR) and processes it for PBR environment lighting.
 * Returns a PMREM-processed texture suitable for use with scene.environment.
 *
 * @param name - The name of the world texture (without .exr extension)
 * @returns Promise resolving to the processed PMREM texture or null on error
 */
export async function loadWorldTexture(name: WorldTextureName): Promise<THREE.Texture | null> {
	const filename = `${name}.exr`
	const url = `/textures/world/${filename}`

	const texture = await loadEXR({ url, filename })

	if (!texture) return null

	texture.mapping = THREE.EquirectangularReflectionMapping
	const envMap = pmremGenerator?.fromEquirectangular(texture).texture ?? null

	texture.dispose()

	return envMap
}

type WorldTextureName =
	| 'city'
	| 'courtyard'
	| 'forest'
	| 'interior'
	| 'night'
	| 'studio'
	| 'sunrise'
	| 'sunset'
