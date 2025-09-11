import {
	computeBoundsTree,
	disposeBoundsTree,
	computeBatchedBoundsTree,
	disposeBatchedBoundsTree,
	acceleratedRaycast
} from 'three-mesh-bvh'

declare module 'three' {
	interface BufferGeometry {
		computeBoundsTree: typeof computeBoundsTree
		disposeBoundsTree: typeof disposeBoundsTree
	}

	interface Mesh {
		raycast: typeof acceleratedRaycast
	}

	interface BatchedMesh {
		computeBoundsTree: typeof computeBatchedBoundsTree
		disposeBoundsTree: typeof disposeBatchedBoundsTree
		raycast: typeof acceleratedRaycast
	}
}
