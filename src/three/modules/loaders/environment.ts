import THREE from '@/three'
import { EXRLoader } from 'three/examples/jsm/Addons.js'
import { useProgressStore } from '@/store/progress'
import { useToast } from '@/composables/toast'
import { pmremGenerator } from '../extras/pmremGenerator'

const exrLoader = new EXRLoader().setPath('/textures/world/')

const toast = useToast()

export async function loadWorldTexture(name: WorldTextureName): Promise<THREE.Texture | null> {
	const progressStore = useProgressStore()
	const filename = `${name}.exr`
	const progressItem = progressStore.initProgress(filename)
	try {
		const texture = await exrLoader.loadAsync(filename, progressItem.onProgress)
		texture.mapping = THREE.EquirectangularReflectionMapping
		const envMap = pmremGenerator?.fromEquirectangular(texture).texture ?? null
		return envMap
	} catch (err) {
		const error = err as Error
		toast.add({ type: 'error', message: 'Error when loading world texture' })
		if (import.meta.env.DEV) console.error(error.name, error.message)
		return null
	} finally {
		progressItem.stop()
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
