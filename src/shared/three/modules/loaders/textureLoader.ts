import { useToast } from '@/shared/lib/toast'
import { useProgressStore } from '@/app/model/progress'
import THREE from '@/shared/three'
import { textureToEnvMap } from '@/shared/three/utils'

export async function loadTexture({ url, filename, size, isEnvMap }: TextureLoaderParameters) {
	const toast = useToast()
	const loader = new THREE.TextureLoader()
	const progressStore = useProgressStore()
	const progressItem = progressStore.initProgress(filename)

	try {
		progressItem.start(size)
		const texture = await loader.loadAsync(url)
		texture.name = filename

		if (isEnvMap) return textureToEnvMap(texture)

		return texture
	} catch (e) {
		const error = e as Error
		toast.add({
			type: 'error',
			title: 'Error loading a texture',
			message: error.message
		})
		if (import.meta.env.DEV) console.error(`loadTexture (${url}) error:`, e)
		return null
	} finally {
		progressItem.stop()
	}
}

interface TextureLoaderParameters {
	url: string
	filename: string
	size?: number
	isEnvMap?: boolean
}
