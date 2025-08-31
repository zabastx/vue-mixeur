import { PointLight } from 'three'

export function createPointLight({ color, decay, distance, intensity }: PointLightOptions) {
	const light = new PointLight(color, intensity, distance, decay)
	return light
}

interface PointLightOptions {
	color?: ConstructorParameters<typeof PointLight>[0]
	intensity?: ConstructorParameters<typeof PointLight>[1]
	distance?: ConstructorParameters<typeof PointLight>[2]
	decay?: ConstructorParameters<typeof PointLight>[3]
}
