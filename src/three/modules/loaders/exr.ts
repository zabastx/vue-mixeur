import { useToast } from '@/composables/toast'
import { useProgressStore } from '@/store/progress'
import { EXRLoader } from 'three/examples/jsm/Addons.js'

/**
 * Loads an EXR (Extended Dynamic Range) image file and returns a DataTexture.
 *
 * This function asynchronously loads EXR files, which are high dynamic range (HDR)
 * image formats commonly used for environment maps and HDR lighting in Three.js.
 * Supports optional size parameter for progress tracking.
 *
 * @param parameters - The load parameters
 * @param parameters.url - URL or path to the EXR file
 * @param parameters.filename - Display name for progress tracking and texture naming
 * @param parameters.size - Optional total size in bytes for accurate progress calculation
 * @returns Promise resolving to the loaded DataTexture or null on error
 *
 * @example
 * ```ts
 * const envTexture = await loadEXR({
 *   url: '/assets/textures/sunset.exr',
 *   filename: 'sunset.exr',
 *   size: 162251
 * })
 * ```
 */
export async function loadEXR({ url, filename, size }: EXRLoaderParameters) {
	const loader = new EXRLoader()

	const toast = useToast()
	const progressStore = useProgressStore()
	const progressItem = progressStore.initProgress(filename)

	try {
		progressItem.start(size)
		const texture = await loader.loadAsync(url, progressItem.onProgress)
		texture.name = filename
		return texture
	} catch (e) {
		const error = e as Error
		toast.add({
			type: 'error',
			title: 'Error loading an EXR',
			message: error.message
		})
		if (import.meta.env.DEV) console.error(`loadEXR (${url}) error:`, e)
		return null
	} finally {
		progressItem.stop()
	}
}

interface EXRLoaderParameters {
	url: string
	filename: string
	size?: number
}
