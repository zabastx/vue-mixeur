import {
	computeBoundsTree,
	disposeBoundsTree,
	computeBatchedBoundsTree,
	disposeBatchedBoundsTree,
	acceleratedRaycast
} from 'three-mesh-bvh'

interface Object3DUserData {
	isShadable?: boolean
	[key: string]: unknown
}

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

	interface Object3D {
		userData: Object3DUserData
	}
}
