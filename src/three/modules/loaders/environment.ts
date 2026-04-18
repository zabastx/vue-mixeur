import THREE from '@/three'
import { loadEXR } from './exr'
import { pmremGenerator } from '../extras/pmremGenerator'

const worldMapCache = new Map<string, THREE.Texture>()

export function disposeWorldMapCache() {
	worldMapCache.forEach((texture) => texture.dispose())
	worldMapCache.clear()
}

/**
 * Loads a world texture (EXR) and processes it for PBR environment lighting.
 * Results are cached by name — subsequent calls with the same name return the cached texture.
 *
 * @param name - One of the predefined world map names (see `DEFAULT_WORLD_MAPS`)
 * @returns The PMREM-processed texture ready for use as `scene.environment`, or `null` if
 * the EXR failed to load or `pmremGenerator` is not yet initialized
 */
export async function loadWorldTexture(name: (typeof DEFAULT_WORLD_MAPS)[number]) {
	const cached = worldMapCache.get(name)
	if (cached) return cached

	const filename = `${name}.exr`
	const url = `/textures/world/${filename}`

	const texture = await loadEXR({ url, filename })

	if (!texture) return null

	texture.mapping = THREE.EquirectangularReflectionMapping
	const envMap = pmremGenerator?.fromEquirectangular(texture).texture

	texture.dispose()

	if (!envMap) return null

	envMap.name = name

	worldMapCache.set(name, envMap)

	return envMap
}

export const DEFAULT_WORLD_MAPS = [
	'city',
	'courtyard',
	'forest',
	'interior',
	'night',
	'studio',
	'sunrise',
	'sunset'
] as const
