import THREE from '@/three'
import { InfiniteGridHelper } from './InfiniteGridHelper'

export function setGridHelper(scene: THREE.Scene) {
	const grid = new InfiniteGridHelper(1, 10, new THREE.Color(0.48, 0.48, 0.48), 1000)
	grid.renderOrder = -1
	scene.add(grid)
	const axes = new THREE.AxesHelper(1000)
	axes.renderOrder = 3
	scene.add(axes)
	return grid
}
