import THREE from '@/three'
import { EXRLoader } from 'three/examples/jsm/Addons.js'
import { useProgressStore, type LoadingProgress } from '@/store/progress'
import { useToast } from '@/composables/useToast'
import { pmremGenerator } from '../extras/pmremGenerator'

const exrLoader = new EXRLoader().setPath('/textures/world/')

export async function loadWorldTexture(name: WorldTextureName): Promise<THREE.Texture | null> {
	const progressStore = useProgressStore()
	const loadingId = `env-${Date.now()}-${Math.random().toString(36).slice(2)}`

	try {
		const texture = await exrLoader.loadAsync(`${name}.exr`, onProgress)
		texture.mapping = THREE.EquirectangularReflectionMapping
		const envMap = pmremGenerator?.fromEquirectangular(texture).texture ?? null
		return envMap
	} catch (err) {
		const error = err as Error
		useToast().toast.error('Error when loading world texture')
		if (import.meta.env.DEV) console.error(error.name, error.message)
		return null
	} finally {
		progressStore.finishLoading(loadingId)
	}

	function onProgress(e: ProgressEvent) {
		if (e.lengthComputable) {
			if (progressStore.loadingItems.find((p: LoadingProgress) => p.id === loadingId)) {
				progressStore.updateProgress(loadingId, e.loaded)
			} else {
				progressStore.startLoading(loadingId, `${name}.exr`, e.total)
			}
		}
	}
}

type WorldTextureName =
	| 'city'
	| 'courtyard'
	| 'forest'
	| 'interior'
	| 'night'
	| 'studio'
	| 'sunrise'
	| 'sunset'
