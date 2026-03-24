import { useToast } from '@/composables/toast'
import { useProgressStore } from '@/store/progress'
import THREE from '@/three'
import { FBXLoader } from 'three/examples/jsm/Addons.js'

/**
 * Loads an FBX (Filmbox) 3D model file and returns the parsed object.
 *
 * This function asynchronously loads FBX files, which is a common 3D model format
 * used in many 3D software packages and game engines. It supports custom URL
 * modifiers for asset path resolution.
 *
 * @param parameters - The load parameters
 * @param parameters.url - URL or path to the FBX file
 * @param parameters.filename - Display name for progress tracking
 * @param parameters.urlModifier - Optional function to transform URLs (e.g., to resolve relative paths)
 * @returns Promise resolving to the loaded THREE.Object3D, or undefined on error
 *
 * @example
 * ```ts
 * const fbx = await loadFBX({
 *   url: '/assets/models/character.fbx',
 *   filename: 'character.fbx'
 * })
 * ```
 *
 * @example
 * ```ts
 * // With URL modifier for asset path resolution
 * const fbx = await loadFBX({
 *   url: '/models/scene.fbx',
 *   filename: 'scene.fbx',
 *   urlModifier: (url) => `/assets/${url}`
 * })
 * ```
 */
export async function loadFBX({ url, filename, urlModifier }: LoadFBXParameters) {
	const loader = new FBXLoader()

	const toast = useToast()
	const progressStore = useProgressStore()
	const progressItem = progressStore.initProgress(filename)

	try {
		if (urlModifier) {
			const manager = new THREE.LoadingManager()
			manager.setURLModifier(urlModifier)
			loader.manager = manager
		}

		const fbx = await loader.loadAsync(url, progressItem.onProgress)
		return fbx
	} catch (e) {
		const error = e as Error
		toast.add({
			type: 'error',
			title: 'Error loading FBX',
			message: error.message
		})
		if (import.meta.env.DEV) console.error('loadFBX Error\n', error)
	} finally {
		progressItem.stop()
	}
}

interface LoadFBXParameters {
	url: string
	filename: string
	urlModifier?: (url: string) => string
}
