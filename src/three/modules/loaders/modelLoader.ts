import { LoadingManager } from 'three'
import { useToast } from '@/composables/useToast'
import { useProgressStore } from '@/store/progress'

export async function loadModel({
	url,
	format,
	filename,
	onProgress,
	textureUrlMap
}: ModelLoaderParameters) {
	const ext = (format || url.split('.').pop() || '').toLowerCase()
	const progressStore = useProgressStore()
	const loadingId = `model-${Date.now()}-${Math.random().toString(36).slice(2)}`

	try {
		// Wrap the onProgress callback to track progress
		const originalOnProgress = onProgress
		const wrappedOnProgress = (e: ProgressEvent) => {
			if (e.lengthComputable) {
				if (progressStore.loadingItems.find((p) => p.id === loadingId)) {
					progressStore.updateProgress(loadingId, e.loaded)
				} else {
					progressStore.startLoading(loadingId, filename, e.total)
				}
			}
			originalOnProgress?.(e)
		}

		switch (ext) {
			case 'gltf':
			case 'glb': {
				const { GLTFLoader } = await import('three/examples/jsm/loaders/GLTFLoader.js')
				const { DRACOLoader } = await import('three/examples/jsm/loaders/DRACOLoader.js')
				const { MeshoptDecoder } = await import('three/examples/jsm/libs/meshopt_decoder.module.js')

				// Create a custom loading manager if we have a texture URL map
				let manager: LoadingManager | undefined
				if (textureUrlMap) {
					manager = new LoadingManager()
					manager.setURLModifier((resourceUrl) => {
						// Check if this URL needs to be remapped
						for (const [pattern, actualUrl] of Object.entries(textureUrlMap)) {
							if (resourceUrl.includes(pattern) || resourceUrl.endsWith(pattern)) {
								return actualUrl
							}
						}
						return resourceUrl
					})
				}

				const loader = new GLTFLoader(manager)
				const dracoLoader = new DRACOLoader()

				dracoLoader.setDecoderPath('/draco/')
				loader.setDRACOLoader(dracoLoader)

				loader.setMeshoptDecoder(MeshoptDecoder)

				const gltf = await loader.loadAsync(url, wrappedOnProgress)
				return gltf.scene
			}

			case 'obj': {
				const { OBJLoader } = await import('three/examples/jsm/loaders/OBJLoader.js')
				const loader = new OBJLoader()
				return await loader.loadAsync(url, wrappedOnProgress)
			}

			case 'fbx': {
				const { FBXLoader } = await import('three/examples/jsm/loaders/FBXLoader.js')
				const loader = new FBXLoader()
				return await loader.loadAsync(url, wrappedOnProgress)
			}

			default:
				throw new Error(`Unsupported format: ${ext}`)
		}
	} catch (e) {
		const error = e as Error
		console.error(`Error loading a model (${url}):`, error.name, error.message)
		useToast().toast.error('', {
			title: `Error loading a model`,
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

export interface ModelLoaderParameters {
	url: string
	filename: string
	format: 'gltf' | 'glb' | 'obj' | 'fbx' | (string & {})
	onProgress?: (e: ProgressEvent) => void
	/** Map of texture filenames to their actual URLs (for PolyHaven models) */
	textureUrlMap?: Record<string, string>
}
