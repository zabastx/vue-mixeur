import type { ShadingMode } from './store/types/shading'

declare global {
	interface DocumentEventMap {
		'shading:modeChange': CustomEvent<ShadingMode>
	}
}
