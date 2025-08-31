import * as THREE from 'three'

export function setGridHelper(scene: THREE.Scene) {
	// Мелкая сетка (обычные линии)
	const fine = new THREE.GridHelper(200, 200, 0x999999, 0x3f3f3f)
	fine.material.transparent = true
	fine.material.opacity = 0.35
	fine.material.depthWrite = false
	scene.add(fine)

	// Крупная сетка
	// const coarse = new THREE.GridHelper(200, 20)
	// coarse.material.transparent = true
	// coarse.material.opacity = 0.5
	// coarse.material.depthWrite = false
	// coarse.renderOrder = 1
	// scene.add(coarse)

	// Центральные оси по центру сетки 54545480
	const center = new THREE.GridHelper(200, 200, 0x545454, 0x545454)
	center.material.transparent = true
	center.material.opacity = 0.5
	center.material.depthWrite = false
	center.renderOrder = 2
	scene.add(center)

	const axes = new THREE.AxesHelper(1000)
	axes.renderOrder = 3
	scene.add(axes)
}

export function createBlenderGrid(size = 200, divisions = 200) {
	const grid = new THREE.Group()
	grid.name = 'Blender Grid'

	// Мелкая сетка #54545480
	const fine = new THREE.GridHelper(size, divisions, 0x545454, 0x444444)
	fine.material.transparent = true
	fine.material.opacity = 0.4
	grid.add(fine)

	// Линия X (красная)
	const xLineGeom = new THREE.BufferGeometry().setFromPoints([
		new THREE.Vector3(-size / 2, 0, 0),
		new THREE.Vector3(size / 2, 0, 0)
	])
	const xLine = new THREE.Line(xLineGeom, new THREE.LineBasicMaterial({ color: 0xff0000 }))
	grid.add(xLine)

	// Линия Y (зелёная)
	const yLineGeom = new THREE.BufferGeometry().setFromPoints([
		new THREE.Vector3(0, 0, -size / 2),
		new THREE.Vector3(0, 0, size / 2)
	])
	const yLine = new THREE.Line(yLineGeom, new THREE.LineBasicMaterial({ color: 0x00ff00 }))
	grid.add(yLine)

	return grid
}
