import type { ShadingMode } from './store/types/shading'
import type THREE from './three'

declare global {
	interface DocumentEventMap {
		'shading:modeChange': CustomEvent<ShadingMode>
		'scene:objectDeleted': CustomEvent<null>
		'scene:objectAdded': CustomEvent<THREE.Object3D>
	}
}
