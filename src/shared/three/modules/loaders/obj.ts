import { useToast } from '@/shared/lib/toast'
import { useProgressStore } from '@/app/model/progress'
import THREE from '@/shared/three'
import { MTLLoader, OBJLoader } from 'three/examples/jsm/Addons.js'

/**
 * Loads an OBJ (Wavefront) 3D model file and returns the parsed object.
 *
 * This function asynchronously loads OBJ files, which are a common 3D model format.
 * It can optionally be paired with an MTL MaterialCreator for material assignments.
 * Supports custom URL modifiers for asset path resolution.
 *
 * @param parameters - The load parameters
 * @param parameters.url - URL or path to the OBJ file
 * @param parameters.filename - Display name for progress tracking
 * @param materials - Optional MaterialCreator from loadMTL for applying materials to the model
 * @param parameters.urlModifier - Optional function to transform URLs (e.g., to resolve relative paths)
 * @returns Promise resolving to the loaded THREE.Object3D, or undefined on error
 *
 * @example
 * ```ts
 * const obj = await loadOBJ({
 *   url: '/assets/models/chair.obj',
 *   filename: 'chair.obj'
 * })
 * ```
 *
 * @example
 * ```ts
 * // Load OBJ with materials
 * const materials = await loadMTL({ url: '/models/chair.mtl', filename: 'chair.mtl' })
 * const obj = await loadOBJ({
 *   url: '/models/chair.obj',
 *   filename: 'chair.obj',
 *   materials
 * })
 * ```
 */
export async function loadOBJ({ url, filename, urlModifier, materials }: LoadOBJParameters) {
	const loader = new OBJLoader()

	if (materials) loader.setMaterials(materials)

	const toast = useToast()
	const progressStore = useProgressStore()
	const progressItem = progressStore.initProgress(filename)

	try {
		if (urlModifier) {
			const manager = new THREE.LoadingManager()
			manager.setURLModifier(urlModifier)
			loader.manager = manager
		}

		const obj = await loader.loadAsync(url, progressItem.onProgress)
		return obj
	} catch (e) {
		const error = e as Error
		toast.add({
			type: 'error',
			title: 'Error loading OBJ',
			message: error.message
		})
		if (import.meta.env.DEV) console.error('loadOBJ Error\n', error)
	} finally {
		progressItem.stop()
	}
}

interface LoadOBJParameters {
	url: string
	filename: string
	materials?: MTLLoader.MaterialCreator
	urlModifier?: (url: string) => string
}
