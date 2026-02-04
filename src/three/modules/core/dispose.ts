import THREE from '@/three'

/**
 * Disposes of all resources used by a 3D model and removes it from its parent container.
 *
 * This function recursively disposes:
 * - Geometry buffers
 * - Material resources (including textures)
 * - Removes the model from the scene graph
 * - Shadow maps
 *
 * @param model - The THREE.Object3D containing the model hierarchy to be disposed
 */
export function disposeModel(model: THREE.Object3D) {
	model.traverse((child) => {
		if (child instanceof THREE.Light && child.shadow.map) {
			child.shadow.map.dispose()
		}
		if (child instanceof THREE.Mesh) {
			if (child.geometry) {
				child.geometry.dispose()
			}

			const materials = Array.isArray(child.material) ? child.material : [child.material]

			materials.forEach((material) => {
				if (!material) return

				for (const key in material) {
					const value = material[key]
					if (value && value.isTexture) {
						value.dispose()
					}
				}

				material.dispose()
			})
		}
	})

	if (model.parent) {
		model.removeFromParent()
	}
}
