import { useToast } from '@/composables/useToast'
import { useProgressStore } from '@/store/progress'
import THREE from '@/three'

export async function loadTexture({ url, filename, size }: TextureLoaderParameters) {
	const progressStore = useProgressStore()
	const loadingId = `model-${Date.now()}-${Math.random().toString(36).slice(2)}`

	try {
		const loader = new THREE.TextureLoader()
		progressStore.startLoading(loadingId, filename, size ?? 0)
		const texture = await loader.loadAsync(url)
		texture.name = filename
		return texture
	} catch (e) {
		const error = e as Error
		console.error(`Error loading a texture (${url}):`, error.name, error.message)
		useToast().toast.error('', {
			title: `Error loading a texture`,
			message: error.message
		})
		return null
	} finally {
		progressStore.finishLoading(loadingId)
		if (url.startsWith('blob:')) {
			URL.revokeObjectURL(url)
		}
	}
}

interface TextureLoaderParameters {
	url: string
	filename: string
	size?: number
}
