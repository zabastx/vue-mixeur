import type { loadModel } from '@/three/modules/loaders/modelLoader'

export async function getFile(format: Parameters<typeof loadModel>[0]['format']) {
	return new Promise<{
		url: string
		format: Parameters<typeof loadModel>[0]['format']
		filename: string
	}>((resolve, reject) => {
		try {
			const input = document.createElement('input')
			input.type = 'file'

			if (format === 'gltf') {
				input.accept = '.gltf,.glb'
			} else {
				input.accept = `.${format}`
			}

			input.addEventListener('change', (e: Event) => {
				const $input = e.target as HTMLInputElement
				const file = $input.files?.[0]
				if (!file) return
				const fileUrl = URL.createObjectURL(file)
				resolve({
					url: fileUrl,
					format: format.toLowerCase(),
					filename: file.name
				})
			})

			input.showPicker()
			input.remove()
		} catch (err) {
			const error = err as Error
			reject({ error })
		}
	})
}
