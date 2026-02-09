import { useToast } from '@/composables/useToast'
import THREE from '@/three'
import { downloadFile } from '@/utils/files'
import { GLTFExporter } from 'three/examples/jsm/Addons.js'

const { toast } = useToast()

const isLightExportable = (light: THREE.Light) =>
	light instanceof THREE.PointLight ||
	light instanceof THREE.DirectionalLight ||
	light instanceof THREE.SpotLight

export async function exportModel(scene: THREE.Scene) {
	try {
		const exportScene = new THREE.Scene()
		scene.children.forEach((child) => {
			if (!child.userData.isHelper) {
				if (child instanceof THREE.Light && !isLightExportable(child)) return
				exportScene.add(child.clone(true))
			}
		})

		const exporter = new GLTFExporter()
		const buffer = (await exporter.parseAsync(exportScene, { binary: true })) as ArrayBuffer
		downloadFile(buffer, 'model.glb', { mimeType: 'model/gltf-binary' })
	} catch (error) {
		const err = error as Error
		console.error('Export error:', err.message)
		toast.error('', {
			title: 'Failed to export scene',
			message: err.message
		})
	}
}
