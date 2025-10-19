import THREE from '@/three'
import { RectAreaLightHelper } from 'three/examples/jsm/Addons.js'

/**
 * Creates a light object with appropriate helper based on the specified type.
 *
 * Each light type returns a helper object that can be added to the scene for visualization
 * and interaction.
 *
 * Supported light types:
 * - **Point Light**: Creates a PointLight with PointLightHelper for omnidirectional lighting
 * - **Directional Light**: Creates a DirectionalLight with DirectionalLightHelper for sun-like lighting
 * - **Spot Light**: Creates a SpotLight with SpotLightHelper for focused cone lighting
 * - **Area Light**: Creates a RectAreaLight with RectAreaLightHelper for rectangular area lighting
 *
 * @param options - Configuration object specifying the light type and parameters
 * @param options.type - The type of light to create ('point', 'directional', 'spot', or 'area')
 * @param options.parameters - Optional parameters specific to the light type
 * @returns A light helper object that can be added to the scene
 *
 * @example
 * ```typescript
 * // Create a point light with custom parameters
 * const pointLightHelper = createLight({
 *   type: 'point',
 *   parameters: { color: 0xff0000, intensity: 0.8, distance: 100 }
 * });
 * scene.add(pointLightHelper);
 *
 * // Create a directional light with default parameters
 * const directionalLightHelper = createLight({ type: 'directional' });
 * scene.add(directionalLightHelper);
 *
 * // Create a spot light with custom angle
 * const spotLightHelper = createLight({
 *   type: 'spot',
 *   parameters: { angle: Math.PI / 6 }
 * });
 * scene.add(spotLightHelper);
 *
 * // Create an area light with custom dimensions
 * const areaLightHelper = createLight({
 *   type: 'area',
 *   parameters: { width: 10, height: 5 }
 * });
 * scene.add(areaLightHelper);
 * ```
 */
export function createLight({ type, parameters }: CreateLightParams) {
	let helper

	switch (type) {
		case 'PointLight':
			helper = createPointLight(parameters)
			break

		case 'DirectionalLight':
			helper = createDirectionalLight(parameters)
			break

		case 'SpotLight':
			helper = createSpotLight(parameters)
			break

		case 'RectAreaLight':
			helper = createAreaLight(parameters)
			break
	}

	helper.light.name = type
	helper.name = `${type}Helper`
	helper.userData.isSceneLight = true
	helper.children.forEach((child) => {
		child.userData.skipRaycast = true
	})
	return helper
}

export function getLightHelper(light: THREE.Light) {
	let helper
	switch (true) {
		case light instanceof THREE.PointLight:
			helper = new THREE.PointLightHelper(light, 0.5)
			break
		case light instanceof THREE.DirectionalLight:
			helper = new THREE.DirectionalLightHelper(light, 1)
			break
		case light instanceof THREE.SpotLight:
			helper = new THREE.SpotLightHelper(light)
			break
		case light instanceof THREE.RectAreaLight:
			helper = new RectAreaLightHelper(light)
			break
	}
	if (!helper) return
	helper.light.name = light.type
	helper.name = `${light.type}Helper`
	helper.userData.isSceneLight = true
	helper.children.forEach((child) => {
		child.userData.skipRaycast = true
	})
	return helper
}

function createPointLight(parameters: PointLightOptions['parameters']) {
	const light = new THREE.PointLight(
		parameters?.color,
		parameters?.intensity,
		parameters?.distance,
		parameters?.decay
	)
	light.shadow.bias = -0.001
	light.castShadow = true
	const helper = new THREE.PointLightHelper(light, 0.5)
	return helper
}

function createDirectionalLight(parameters: DirectionalLightOptions['parameters']) {
	const light = new THREE.DirectionalLight(parameters?.color, parameters?.intensity)
	light.shadow.bias = -0.0001
	light.castShadow = true
	const helper = new THREE.DirectionalLightHelper(light, 1)
	return helper
}

function createSpotLight(parameters: SpotLightOptions['parameters']) {
	const light = new THREE.SpotLight(
		parameters?.color,
		parameters?.intensity,
		parameters?.distance,
		parameters?.angle
	)
	light.castShadow = true
	const helper = new THREE.SpotLightHelper(light)
	return helper
}

function createAreaLight(parameters: AreaLightOptions['parameters']) {
	const light = new THREE.RectAreaLight(
		parameters?.color,
		parameters?.intensity,
		parameters?.width,
		parameters?.height
	)
	const helper = new RectAreaLightHelper(light)
	return helper
}

export type CreateLightParams =
	| PointLightOptions
	| DirectionalLightOptions
	| SpotLightOptions
	| AreaLightOptions

export interface PointLightOptions {
	type: 'PointLight'
	parameters?: {
		color?: ConstructorParameters<typeof THREE.PointLight>[0]
		intensity?: ConstructorParameters<typeof THREE.PointLight>[1]
		distance?: ConstructorParameters<typeof THREE.PointLight>[2]
		decay?: ConstructorParameters<typeof THREE.PointLight>[3]
	}
}

export interface DirectionalLightOptions {
	type: 'DirectionalLight'
	parameters?: {
		color?: ConstructorParameters<typeof THREE.DirectionalLight>[0]
		intensity?: ConstructorParameters<typeof THREE.DirectionalLight>[1]
	}
}

export interface SpotLightOptions {
	type: 'SpotLight'
	parameters?: {
		color?: ConstructorParameters<typeof THREE.SpotLight>[0]
		intensity?: ConstructorParameters<typeof THREE.SpotLight>[1]
		distance?: ConstructorParameters<typeof THREE.SpotLight>[2]
		angle?: ConstructorParameters<typeof THREE.SpotLight>[3]
	}
}

export interface AreaLightOptions {
	type: 'RectAreaLight'
	parameters?: {
		color?: ConstructorParameters<typeof THREE.RectAreaLight>[0]
		intensity?: ConstructorParameters<typeof THREE.RectAreaLight>[1]
		width?: ConstructorParameters<typeof THREE.RectAreaLight>[2]
		height?: ConstructorParameters<typeof THREE.RectAreaLight>[3]
	}
}

export type LightHelper =
	| THREE.PointLightHelper
	| THREE.SpotLightHelper
	| THREE.DirectionalLightHelper
	| RectAreaLightHelper
