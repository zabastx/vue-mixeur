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

THREE.Cache.enabled = true

export default THREE
