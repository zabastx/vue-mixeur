import { useToast } from '@/composables/toast'
import { useProgressStore } from '@/store/progress'
import type THREE from '@/three'
import { EXRLoader } from 'three/examples/jsm/Addons.js'

/**
 * Loads an EXR file from a URL and returns a Three.js Texture.
 *
 * @param options.url - URL of the EXR file to load
 * @param options.filename - Display name used for progress tracking and texture naming
 * @param options.size - Total file size in bytes for accurate progress reporting
 * @returns The loaded texture, or `null` if loading failed
 */
export async function loadEXR({
	url,
	filename,
	size
}: EXRLoaderParameters): Promise<THREE.Texture | null> {
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
		const message = e instanceof Error ? e.message : String(e)
		toast.add({
			type: 'error',
			title: 'Error loading an EXR',
			message
		})
		if (import.meta.env.DEV) console.error(`loadEXR: (${url}) error:`, e)
		return null
	} finally {
		progressItem.stop()
	}
}

type EXRLoaderParameters = {
	url: string
	filename: string
	size?: number
}
