// src/three/utils/renderer/ShadingControls.ts
import { ref, watch } from 'vue'
import THREE from '@/three'
import { ShadingControls, type ShadingMode } from './ShadingControls'

export function useShadingControls(scene: THREE.Scene) {
	const currentMode = ref<ShadingMode>('solid')
	let shadingControls: ShadingControls | null = null

	watch(currentMode, (newMode) => {
		if (shadingControls) {
			shadingControls.setMode(newMode)
		}
	})

	function init() {
		shadingControls = new ShadingControls(scene)
		shadingControls.setMode(currentMode.value)
	}

	function cacheNewObjectMaterials(object: THREE.Object3D) {
		if (shadingControls) {
			shadingControls.cacheNewObjectMaterials(object)
		}
	}

	return {
		currentMode,
		init,
		cacheNewObjectMaterials
	}
}
