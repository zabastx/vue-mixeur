import type { ShadingMode } from './store/types/shading'
import type THREE from './three'

declare global {
	interface DocumentEventMap {
		'shading:modeChange': CustomEvent<ShadingMode>
		'scene:objectDeleted': CustomEvent<THREE.Object3D>
		'scene:lightAdded': CustomEvent<THREE.Object3D>
		'scene:modelAdded': CustomEvent<THREE.Object3D>
	}
}
