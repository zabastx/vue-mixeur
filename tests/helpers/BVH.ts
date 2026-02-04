import * as THREE from 'three'
import { expect, vi } from 'vitest'

export function hasBVH(geometry: THREE.BufferGeometry): boolean {
	return !!geometry._hasBoundsTree
}

export function createMockBVH() {
	return {
		raycast: vi.fn(),
		raycastFirst: vi.fn(),
		intersectsGeometry: vi.fn(),
		shapecast: vi.fn(),
		closestPointToPoint: vi.fn()
	}
}

export function expectBVHComputed(mesh: THREE.Mesh) {
	expect(mesh.geometry._hasBoundsTree).toBe(true)
}

export function expectBVHDisposed(mesh: THREE.Mesh) {
	expect(mesh.geometry._hasBoundsTree).toBe(false)
}
