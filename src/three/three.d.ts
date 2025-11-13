import {
	computeBoundsTree,
	disposeBoundsTree,
	computeBatchedBoundsTree,
	disposeBatchedBoundsTree,
	acceleratedRaycast
} from 'three-mesh-bvh'
import type THREE from '.'

interface Object3DUserData {
	isShadable?: boolean
	isHelper?: boolean
	isSceneLight?: boolean
	skipRaycast?: boolean
	isSelectable?: boolean
	[key: string]: unknown
}

declare module 'three' {
	interface BufferGeometry {
		computeBoundsTree: typeof computeBoundsTree
		disposeBoundsTree: typeof disposeBoundsTree
	}

	interface Mesh {
		raycast: typeof acceleratedRaycast
		userData: {
			originalMaterial?: THREE.Material | THREE.Material[]
		} & Object3DUserData
	}

	interface BatchedMesh {
		computeBoundsTree: typeof computeBatchedBoundsTree
		disposeBoundsTree: typeof disposeBatchedBoundsTree
		raycast: typeof acceleratedRaycast
	}

	interface Object3D {
		userData: Object3DUserData
	}

	interface Light {
		userData: Object3DUserData
	}
}
