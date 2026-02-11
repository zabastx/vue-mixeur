import THREE from '@/three'
import { RectAreaLightHelper } from 'three/examples/jsm/Addons.js'

export function createLight<T extends CreateLightParams>({ type, parameters }: T) {
	let light
	switch (type) {
		case 'point':
			light = new THREE.PointLight(
				parameters?.color,
				parameters?.intensity ?? 10,
				parameters?.distance,
				parameters?.decay
			)
			break

		case 'sun':
			light = new THREE.DirectionalLight(parameters?.color, parameters?.intensity ?? 10)
			light.target.name = 'DirectionalLightTarget'
			light.target.position.set(0, 0, -1)
			light.add(light.target)
			break

		case 'spot':
			light = new THREE.SpotLight(
				parameters?.color,
				parameters?.intensity ?? 10,
				parameters?.distance,
				parameters?.angle
			)
			light.target.name = 'SpotLightTarget'
			light.target.position.set(0, 0, -1)
			light.add(light.target)
			break

		case 'area':
			light = new THREE.RectAreaLight(
				parameters?.color,
				parameters?.intensity ?? 10,
				parameters?.width,
				parameters?.height
			)
			break
	}

	if (light.shadow) {
		light.shadow.bias = -0.001
		light.shadow.normalBias = 0.02
	}

	light.name = type
	return light as CreateLightReturn<T>
}

type CreateLightReturn<T> = T extends PointLightOptions
	? THREE.PointLight
	: T extends DirectionalLightOptions
		? THREE.DirectionalLight
		: T extends SpotLightOptions
			? THREE.SpotLight
			: T extends AreaLightOptions
				? THREE.RectAreaLight
				: THREE.PointLight | THREE.DirectionalLight | THREE.SpotLight | THREE.RectAreaLight

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
	helper.userData = {
		isHelper: true
	}
	helper.traverse((child) => {
		child.userData.skipRaycast = true
	})
	return helper
}

export type CreateLightParams =
	| PointLightOptions
	| DirectionalLightOptions
	| SpotLightOptions
	| AreaLightOptions

export interface BaseLightParameters {
	/** Numeric value of the light's strength/intensity. Expects a `Float`. Default `1` */
	intensity?: number
	/** Hexadecimal color of the light. Default is 0xffffff (white). Expects an `Integer`. */
	color?: number
}

export interface PointLightOptions {
	type: 'point'
	parameters?: {
		/** Maximum range of the light. Default is 0 (no limit). */
		distance?: ConstructorParameters<typeof THREE.PointLight>[2]
		/** The amount the light dims along the distance of the light. Expects a `Float`. Default `2` */
		decay?: ConstructorParameters<typeof THREE.PointLight>[3]
	} & BaseLightParameters
}

export interface DirectionalLightOptions {
	type: 'sun'
	parameters?: BaseLightParameters
}

export interface SpotLightOptions {
	type: 'spot'
	parameters?: {
		/** Maximum range of the light. Default is 0 (no limit). Expects a `Float`. */
		distance?: ConstructorParameters<typeof THREE.SpotLight>[2]
		/** Maximum angle of light dispersion from its direction whose upper bound is Math.PI/2. */
		angle?: ConstructorParameters<typeof THREE.SpotLight>[3]
	} & BaseLightParameters
}

export interface AreaLightOptions {
	type: 'area'
	parameters?: {
		/** Width of the light. Expects a `Float`. Default `10` */
		width?: ConstructorParameters<typeof THREE.RectAreaLight>[2]
		/** Height of the light. Expects a `Float`. Default `10` */
		height?: ConstructorParameters<typeof THREE.RectAreaLight>[3]
	} & BaseLightParameters
}

export type LightHelper =
	| THREE.PointLightHelper
	| THREE.SpotLightHelper
	| THREE.DirectionalLightHelper
	| RectAreaLightHelper
