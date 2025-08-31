import type { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'

export async function loadGLTF({ url, onProgress }: GLTFLoaderArgs) {
	try {
		const { GLTFLoader } = await import('three/addons/loaders/GLTFLoader.js')
		const gltfLoader = new GLTFLoader()
		return await gltfLoader.loadAsync(url, onProgress)
	} catch (err) {
		const error = err as Error
		console.error('loadGLTF Error', error.name, '\nmessage: ', error.message)
		return null
	}
}

type GLTFLoaderArgs = {
	url: Parameters<GLTFLoader['loadAsync']>['0']
	onProgress?: Parameters<GLTFLoader['loadAsync']>['1']
}
