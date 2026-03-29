import { useToast } from '@/composables/toast'
import { useProgressStore } from '@/store/progress'
import THREE from '@/three'
import { MTLLoader, type MaterialCreatorOptions } from 'three/examples/jsm/Addons.js'

/**
 * Loads an MTL (Material Template Library) file and returns a MaterialCreator.
 *
 * This function asynchronously loads MTL files commonly used with OBJ models to
 * provide material definitions. It supports custom URL modifiers for asset path
 * resolution and material options for configuring the material creation process.
 *
 * @param parameters - The load parameters
 * @param parameters.url - URL or path to the MTL file
 * @param parameters.filename - Display name for progress tracking
 * @param parameters.materialOptions - Optional options for MaterialCreator (side, invertTransparent, etc.)
 * @param parameters.urlModifier - Optional function to transform URLs (e.g., to resolve relative paths)
 * @returns Promise resolving to the loaded MaterialCreator, or undefined on error
 *
 * @example
 * ```ts
 * const materials = await loadMTL({
 *   url: '/assets/models/materials.mtl',
 *   filename: 'materials.mtl',
 *   materialOptions: { side: THREE.DoubleSide }
 * })
 * ```
 *
 * @example
 * ```ts
 * // With URL modifier for relative texture paths
 * const materials = await loadMTL({
 *   url: '/models/chair.mtl',
 *   filename: 'chair.mtl',
 *   urlModifier: (url) => `/assets/${url}`
 * })
 * ```
 */
export async function loadMTL({ url, filename, urlModifier, materialOptions }: LoadMTLParameters) {
	const loader = new MTLLoader()

	if (materialOptions) loader.setMaterialOptions(materialOptions)

	const toast = useToast()
	const progressStore = useProgressStore()
	const progressItem = progressStore.initProgress(filename)

	try {
		if (urlModifier) {
			const manager = new THREE.LoadingManager()
			manager.setURLModifier(urlModifier)
			loader.manager = manager
		}

		const mtl = await loader.loadAsync(url, progressItem.onProgress)
		return mtl
	} catch (e) {
		const error = e as Error
		toast.add({
			type: 'error',
			title: 'Error loading MTL',
			message: error.message
		})
		if (import.meta.env.DEV) console.error('loadMTL Error\n', error)
	} finally {
		progressItem.stop()
	}
}

interface LoadMTLParameters {
	url: string
	filename: string
	materialOptions?: MaterialCreatorOptions
	urlModifier?: (url: string) => string
}
