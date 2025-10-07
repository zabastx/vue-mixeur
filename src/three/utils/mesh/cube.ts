import THREE from '@/three'

let cubeCount = 0

export function createCube(params?: CubeCreateParams) {
	cubeCount++
	const geometry = new THREE.BoxGeometry(
		params?.geometry?.width,
		params?.geometry?.height,
		params?.geometry?.depth,
		params?.geometry?.widthSegments,
		params?.geometry?.heightSegments,
		params?.geometry?.depthSegments
	)
	const mat = new THREE.MeshStandardMaterial(params?.material)
	const cube = new THREE.Mesh(geometry, mat)
	cube.name = 'Cube.' + `${cubeCount}`.padStart(3, '0')
	return cube
}

export interface BoxGeometryParams {
	width?: number
	height?: number
	depth?: number
	widthSegments?: number
	heightSegments?: number
	depthSegments?: number
}

export interface CubeCreateParams {
	geometry?: BoxGeometryParams
	material?: THREE.MeshStandardMaterialParameters
}
