import { useToast } from '@/composables/toast'
import { useProgressStore } from '@/store/progress'
import { EXRLoader } from 'three/examples/jsm/Addons.js'

const toast = useToast()
const loader = new EXRLoader()

export async function loadEXR({ url, filename, size }: EXRLoaderParameters) {
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
		if (url.startsWith('blob:')) {
			URL.revokeObjectURL(url)
		}
	}
}

interface EXRLoaderParameters {
	url: string
	filename: string
	size?: number
}
