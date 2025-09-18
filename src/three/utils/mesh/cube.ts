import THREE from '@/three'

let cubeCount = 0

export function createCube() {
	cubeCount++
	const mat = new THREE.MeshStandardMaterial()
	const cube = new THREE.Mesh(new THREE.BoxGeometry(), mat)
	cube.name = 'Cube.' + `${cubeCount}`.padStart(3, '0')
	return cube
}
