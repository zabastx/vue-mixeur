import { useToast } from '@/shared/lib/toast'
import { useProgressStore } from '@/app/model/progress'
import THREE from '@/shared/three'
import { DRACOLoader, GLTFLoader, KTX2Loader } from 'three/examples/jsm/Addons.js'
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js'

/**
 * Loads a GLTF/GLB (Graphics Library Transmission Format) 3D model file and returns a GLTF.
 *
 * This function asynchronously loads GLTF files, which is the modern standard for 3D web graphics.
 * It automatically configures support for Draco compression, KTX2 textures, and Meshopt optimization.
 * Supports custom URL modifiers for asset path resolution.
 *
 * @param parameters - The load parameters
 * @param parameters.url - URL or path to the GLTF/GLB file
 * @param parameters.filename - Display name for progress tracking
 * @param parameters.isBinary - Whether the file is binary GLB format (skips progress for .gltf)
 * @param parameters.urlModifier - Optional function to transform URLs (e.g., to resolve relative paths)
 * @returns Promise resolving to the loaded GLTF, or undefined on error
 *
 * @example
 * ```ts
 * const gltf = await loadGTLF({
 *   url: '/assets/models/scene.gltf',
 *   filename: 'scene.gltf'
 * })
 * ```
 *
 * @example
 * ```ts
 * // Load binary GLB
 * const gltf = await loadGTLF({
 *   url: '/assets/models/character.glb',
 *   filename: 'character.glb',
 *   isBinary: true
 * })
 * ```
 */
export async function loadGTLF({ url, isBinary, filename, urlModifier }: LoadGTLFParameters) {
	const loader = new GLTFLoader()
	loader.setMeshoptDecoder(MeshoptDecoder)

	const dracoLoader = new DRACOLoader()
	loader.setDRACOLoader(dracoLoader)
	dracoLoader.setDecoderPath('/draco/')

	const ktx2Loader = new KTX2Loader()
	loader.setKTX2Loader(ktx2Loader)

	const toast = useToast()
	const progressStore = useProgressStore()
	const progressItem = progressStore.initProgress(filename)

	try {
		if (!isBinary) progressItem.start()

		if (urlModifier) {
			const manager = new THREE.LoadingManager()
			manager.setURLModifier(urlModifier)
			loader.manager = manager
		}

		const gltf = await loader.loadAsync(url, progressItem.onProgress)
		return gltf
	} catch (e) {
		const error = e as Error
		toast.add({
			type: 'error',
			title: 'Error loading GTLF',
			message: error.message
		})
		if (import.meta.env.DEV) console.error('loadGTLF Error\n', error)
	} finally {
		progressItem.stop()
	}
}

interface LoadGTLFParameters {
	url: string
	filename: string
	isBinary?: boolean
	urlModifier?: (url: string) => string
}
