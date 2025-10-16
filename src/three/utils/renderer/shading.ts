// src/three/utils/renderer/ShadingControls.ts
import { ref, watch } from 'vue'
import THREE from '@/three'
import { ShadingControls, type ShadingMode } from './ShadingControls'

export function useShadingControls(scene: THREE.Scene) {
	const currentMode = ref<ShadingMode>('solid')
	let shadingControls: ShadingControls | null = null

	// Ambient light for overall illumination
	const ambient = new THREE.AmbientLight(0xffffff, 0.5)

	// Main directional light (key light)
	const mainLight = new THREE.DirectionalLight(0xffffff, 0.8)
	mainLight.position.set(5, 5, 5)

	// Fill directional light for softer lighting
	const fillLight = new THREE.DirectionalLight(0xffffff, 0.3)
	fillLight.position.set(-5, -5, -5)

	const solidModeLights = [ambient, mainLight, fillLight]

	solidModeLights.forEach((item) => scene.add(item))

	watch(currentMode, (newMode) => {
		if (!shadingControls) return
		shadingControls.setMode(newMode)
		if (newMode === 'solid') {
			solidModeLights.forEach((item) => scene.add(item))
		} else {
			solidModeLights.forEach((item) => scene.remove(item))
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
