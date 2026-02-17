import * as THREE from 'three'
import {
	computeBoundsTree,
	disposeBoundsTree,
	computeBatchedBoundsTree,
	disposeBatchedBoundsTree,
	acceleratedRaycast
} from 'three-mesh-bvh'

// Add the extension functions
THREE.BufferGeometry.prototype.computeBoundsTree = computeBoundsTree
THREE.BufferGeometry.prototype.disposeBoundsTree = disposeBoundsTree
THREE.Mesh.prototype.raycast = acceleratedRaycast

THREE.BatchedMesh.prototype.computeBoundsTree = computeBatchedBoundsTree
THREE.BatchedMesh.prototype.disposeBoundsTree = disposeBatchedBoundsTree
THREE.BatchedMesh.prototype.raycast = acceleratedRaycast

/**
 * Recursively enables BVH for all meshes in the object
 */
export function enableBVH(object: THREE.Object3D) {
	object.traverse((child) => {
		if (child instanceof THREE.Mesh && child.geometry) {
			child.geometry.computeBoundsTree()
		}
		if (child instanceof THREE.BatchedMesh) {
			child.computeBoundsTree()
		}
	})
}

/**
 * Recursively disposes BVH for all meshes in the object
 */
export function disposeBVH(object: THREE.Object3D) {
	object.traverse((child) => {
		if (child instanceof THREE.Mesh && child.geometry) {
			child.geometry.disposeBoundsTree()
		}
		if (child instanceof THREE.BatchedMesh) {
			child.disposeBoundsTree()
		}
	})
}

export default THREE
