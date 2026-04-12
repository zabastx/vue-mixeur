import {
	computeBoundsTree,
	disposeBoundsTree,
	computeBatchedBoundsTree,
	disposeBatchedBoundsTree,
	acceleratedRaycast
} from 'three-mesh-bvh'

interface MxObjectUserData {
	isShadable?: boolean
	isHelper?: boolean
	isSceneLight?: boolean
	skipRaycast?: boolean
	isSelectable?: boolean
	mixeur?: {
		isShadable?: boolean
		isHelper?: boolean
		isSceneLight?: boolean
		skipRaycast?: boolean
		isSelectable?: boolean
		visibleIn?: ('wireframe' | 'solid' | 'preview' | 'rendered' | 'export')[]
		hideInOutliner?: boolean
	}
	[key: string]: unknown
}

declare module 'three' {
	interface BufferGeometry {
		computeBoundsTree: typeof computeBoundsTree
		disposeBoundsTree: typeof disposeBoundsTree
		_hasBoundsTree: boolean
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
