import THREE from '@/three'
import { InfiniteGridHelper } from './InfiniteGridHelper'

export function setGridHelper(scene: THREE.Scene) {
	const grid = new InfiniteGridHelper(1, 10, new THREE.Color(0.48, 0.48, 0.48), 1000)
	grid.renderOrder = -1
	grid.name = 'InfiniteGridHelper'
	grid.userData.isHelper = true
	scene.add(grid)

	const axes = getAxes()
	scene.add(axes)
	return grid
}

function getAxes() {
	const axes = new THREE.AxesHelper(1000)
	const axesMirror = axes.clone(true)
	axesMirror.rotateY(Math.PI)
	const axesGroup = new THREE.Group()
	axesGroup.add(axes, axesMirror)
	axesGroup.name = 'AxesHelper'
	axesGroup.userData.isHelper = true
	return axesGroup
}
