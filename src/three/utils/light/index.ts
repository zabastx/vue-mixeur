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
	switch (type) {
		case 'point':
			return createPointLight(parameters)

		case 'directional':
			return createDirectionalLight(parameters)

		case 'spot':
			return createSpotLight(parameters)

		case 'area':
			return createAreaLight(parameters)
	}
}

function createPointLight(parameters: PointLightOptions['parameters']) {
	const light = new THREE.PointLight(
		parameters?.color,
		parameters?.intensity,
		parameters?.distance,
		parameters?.decay
	)
	light.castShadow = true
	light.name = 'pointLight'
	const helper = new THREE.PointLightHelper(light, 0.5)
	helper.name = 'pointLightHelper'
	helper.userData.isSceneLight = true
	return helper
}

function createDirectionalLight(parameters: DirectionalLightOptions['parameters']) {
	const light = new THREE.DirectionalLight(parameters?.color, parameters?.intensity)
	light.castShadow = true
	light.name = 'directionalLight'
	const helper = new THREE.DirectionalLightHelper(light, 0.5)
	helper.name = 'directionalLightHelper'
	helper.userData.isSceneLight = true
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
	light.name = 'spotLight'
	const helper = new THREE.SpotLightHelper(light)
	helper.name = 'spotLightHelper'
	helper.userData.isSceneLight = true
	return helper
}

function createAreaLight(parameters: AreaLightOptions['parameters']) {
	const light = new THREE.RectAreaLight(
		parameters?.color,
		parameters?.intensity,
		parameters?.width,
		parameters?.height
	)
	light.name = 'areaLight'
	const helper = new RectAreaLightHelper(light)
	helper.name = 'areaLightHelper'
	helper.userData.isSceneLight = true
	return helper
}

export type CreateLightParams =
	| PointLightOptions
	| DirectionalLightOptions
	| SpotLightOptions
	| AreaLightOptions

export interface PointLightOptions {
	type: 'point'
	parameters?: {
		color?: ConstructorParameters<typeof THREE.PointLight>[0]
		intensity?: ConstructorParameters<typeof THREE.PointLight>[1]
		distance?: ConstructorParameters<typeof THREE.PointLight>[2]
		decay?: ConstructorParameters<typeof THREE.PointLight>[3]
	}
}

export interface DirectionalLightOptions {
	type: 'directional'
	parameters?: {
		color?: ConstructorParameters<typeof THREE.DirectionalLight>[0]
		intensity?: ConstructorParameters<typeof THREE.DirectionalLight>[1]
	}
}

export interface SpotLightOptions {
	type: 'spot'
	parameters?: {
		color?: ConstructorParameters<typeof THREE.SpotLight>[0]
		intensity?: ConstructorParameters<typeof THREE.SpotLight>[1]
		distance?: ConstructorParameters<typeof THREE.SpotLight>[2]
		angle?: ConstructorParameters<typeof THREE.SpotLight>[3]
	}
}

export interface AreaLightOptions {
	type: 'area'
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
