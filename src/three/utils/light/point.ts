import THREE from '@/three'

export function createPointLight({ color, decay, distance, intensity }: PointLightOptions) {
	const light = new THREE.PointLight(color, intensity, distance, decay)
	return light
}

interface PointLightOptions {
	color?: ConstructorParameters<typeof THREE.PointLight>[0]
	intensity?: ConstructorParameters<typeof THREE.PointLight>[1]
	distance?: ConstructorParameters<typeof THREE.PointLight>[2]
	decay?: ConstructorParameters<typeof THREE.PointLight>[3]
}
