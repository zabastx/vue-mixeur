import * as THREE from 'three'

export type NodeId = string

export interface CollectionNode {
	id: NodeId
	type: 'collection'
	name: string
	parentId: NodeId | null
	children: NodeId[]
	flags: NodeFlags // desired state
	computed: NodeComputed // derived from parents/children
	group: THREE.Group // связь с Three.js
}

export interface ObjectNode {
	id: NodeId
	type: 'object'
	name: string
	parentId: NodeId | null
	children: [] // для простоты — нет
	flags: NodeFlags
	computed: NodeComputed
	object3D: THREE.Object3D
}

export interface NodeFlags {
	visible: Tri // 'on' | 'off' | 'mixed'
	selectable: Tri
	renderable: Tri // hide in render
	locked: boolean // блокируем операции/drag
	solo: boolean // режим solo
}

export interface NodeComputed {
	visible: boolean // реально в вьюпорте
	selectable: boolean // можно ли выделять
	renderable: boolean // попадёт ли в рендер
	hasMixedVisible: boolean // для индикации tri-state
}

export type Tri = 'on' | 'off' | 'mixed'
