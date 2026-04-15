import type { ShadingMode } from '@/store/shading'
import {
	computeBoundsTree,
	disposeBoundsTree,
	computeBatchedBoundsTree,
	disposeBatchedBoundsTree,
	acceleratedRaycast
} from 'three-mesh-bvh'

interface MxTextObjectData {
	textValue: string
}

interface MxObjectUserData {
	isShadable?: boolean
	isHelper?: boolean
	helperUUID?: string
	isSceneLight?: boolean
	isRenderCamera?: boolean
	skipRaycast?: boolean
	isSelectable?: boolean
	hideInModes?: ShadingMode[]
	hideInOutliner?: boolean
	userVisible?: boolean
	text?: MxTextObjectData
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
