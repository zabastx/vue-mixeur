import THREE from '.'
import type { MxObjectUserData } from './three'

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

export function getUserData(obj: THREE.Object3D): MxObjectUserData {
	if (!obj.userData.mixeur) obj.userData.mixeur = {}
	return obj.userData.mixeur
}
