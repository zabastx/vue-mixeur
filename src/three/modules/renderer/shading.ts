import { ref, watch } from 'vue'
import THREE from '@/three'
import { ShadingControls, type ShadingMode } from './ShadingControls'
import type { LightHelper } from '../light'
import { loadWorldTexture } from '../loaders/environment'

export function useShadingControls(scene: THREE.Scene) {
	let shadingControls: ShadingControls | null = null

	const solidModeLights = getSolidShadingLights()
	solidModeLights.forEach((item) => scene.add(item))

	const currentMode = ref<ShadingMode>('solid')

	watch(currentMode, (newMode) => {
		if (!shadingControls) return
		shadingControls.setMode(newMode)

		if (newMode === 'solid') {
			solidModeLights.forEach((item) => scene.add(item))
		} else {
			solidModeLights.forEach((item) => scene.remove(item))
		}

		if (newMode === 'rendered') {
			setSceneLightsVisibility(scene, true)
		} else {
			setSceneLightsVisibility(scene, false)
		}
	})

	function init() {
		shadingControls = new ShadingControls(scene)
		shadingControls.setMode(currentMode.value)

		loadWorldTexture('forest').then((map) => {
			if (!map) return
			shadingControls?.setEnvironmentMap(map)
		})
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

function getSolidShadingLights() {
	// Ambient light for overall illumination
	const ambient = new THREE.AmbientLight(0xffffff, 0.5)
	ambient.name = 'SolidModeAmbientLight'

	// Main directional light (key light)
	const mainLight = new THREE.DirectionalLight(0xffffff, 0.8)
	mainLight.name = 'SolidModeMainLight'
	mainLight.position.set(5, 5, 5)

	// Fill directional light for softer lighting
	const fillLight = new THREE.DirectionalLight(0xffffff, 0.3)
	fillLight.name = 'SolidModeFillLight'
	fillLight.position.set(-5, -5, -5)

	const lights = [ambient, mainLight, fillLight]

	lights.forEach((item) => {
		item.userData = {
			isSceneLight: true,
			isHelper: true
		}
	})

	return lights
}

function setSceneLightsVisibility(scene: THREE.Scene, val: boolean) {
	scene.traverse((obj: LightHelper | THREE.Object3D) => {
		if ('light' in obj && obj.userData.isSceneLight) {
			obj.light.visible = val
		}
	})
}
