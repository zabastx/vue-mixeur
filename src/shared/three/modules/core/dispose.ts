import THREE from '@/shared/three'
import { lightHasShadow } from '../light'
import { toRaw } from 'vue'

/**
 * Disposes of all resources used by a 3D model and removes it from its parent container.
 *
 * This function recursively disposes:
 * - Geometry buffers (all Object3D, not just Mesh)
 * - Material resources (Mesh, Line, Points, Sprite)
 * - Texture resources
 * - Shadow maps
 * - SkinnedMesh skeleton
 * - Render targets
 * - Removes the model from the scene graph
 *
 * @param model - The THREE.Object3D containing the model hierarchy to be disposed
 */
export function disposeModel(model: THREE.Object3D) {
	// Use toRaw to unwrap Vue's reactivity proxy and access the original Three.js object.
	// This ensures internal WebGL properties (like __webglFramebuffer) are accessible.
	const object = toRaw(model)

	try {
		object.traverse((child) => {
			if (child instanceof THREE.Light && lightHasShadow(child)) {
				child.shadow.map?.dispose()
			}

			if (child instanceof THREE.BatchedMesh) {
				child.disposeBoundsTree()
				child.dispose()
			}

			// Dispose geometry for ALL objects with geometry (not just Mesh)
			// This handles CameraHelper, LineSegments, Points, Sprites, etc.
			if ('geometry' in child && child.geometry) {
				const geometry = child.geometry as THREE.BufferGeometry
				geometry.disposeBoundsTree()
				geometry.dispose()
			}

			if (child instanceof THREE.SkinnedMesh && child.skeleton) {
				child.skeleton.dispose()
			}

			if ('material' in child && child.material) {
				disposeMaterial(child.material as THREE.Material | THREE.Material[])
			}
		})

		if (object.parent) {
			object.removeFromParent()
		}
	} catch (e) {
		const error = e as Error
		console.error('disposeModel: ', object, error)
	}
}

/**
 * Helper function to dispose a material and its textures
 */
function disposeMaterial(material: THREE.Material | THREE.Material[]) {
	const materials = Array.isArray(material) ? material : [material]

	materials.forEach((mat) => {
		if (!mat) return

		for (const key in mat) {
			// @ts-expect-error - Material index signature is not fully typed
			const value = mat[key]
			if (value && value.isTexture) {
				value.dispose()
			}
		}

		mat.dispose()
	})
}
