import { TextGeometry, type TextGeometryParameters } from 'three/examples/jsm/Addons.js'
import { loadFont } from '../loaders/font'
import THREE from '@/three'

export async function createText() {
	const font = await loadFont('helvetiker-regular')
	if (!font) return
	const geometry = createTextGeometry({
		text: 'Text',
		params: {
			font,
			size: 2,
			depth: 1
		}
	})
	const mesh = new THREE.Mesh(geometry, new THREE.MeshPhysicalMaterial())
	mesh.name = 'Text'
	return mesh
}

export function createTextGeometry(data: TextGeometryData) {
	const geometry = new TextGeometry(data.text, data.params)
	return geometry
}

export interface TextGeometryData {
	text: string
	params: TextGeometryParameters
}
