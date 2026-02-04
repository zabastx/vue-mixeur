import { vi } from 'vitest'

export const mockTHREE = {
	Scene: vi.fn(() => ({
		children: [],
		add: vi.fn(),
		remove: vi.fn(),
		traverse: vi.fn(),
		getObjectByProperty: vi.fn(),
		addEventListener: vi.fn(),
		background: null
	})),

	PerspectiveCamera: vi.fn(() => ({
		position: { copy: vi.fn(), add: vi.fn(), distanceTo: vi.fn(() => 10) },
		lookAt: vi.fn(),
		up: { set: vi.fn() },
		aspect: 1,
		updateProjectionMatrix: vi.fn()
	})),

	OrthographicCamera: vi.fn(() => ({
		zoom: 1,
		updateProjectionMatrix: vi.fn()
	})),

	WebGLRenderer: vi.fn(() => ({
		setAnimationLoop: vi.fn(),
		render: vi.fn(),
		clearDepth: vi.fn(),
		setSize: vi.fn(),
		dispose: vi.fn(),
		info: { memory: { geometries: 0, textures: 0 } }
	})),

	MOUSE: { LEFT: 0, MIDDLE: 1, RIGHT: 2 },

	Vector3: vi.fn(() => ({
		copy: vi.fn().mockReturnThis(),
		add: vi.fn().mockReturnThis(),
		subVectors: vi.fn().mockReturnThis(),
		normalize: vi.fn().mockReturnThis(),
		multiplyScalar: vi.fn().mockReturnThis(),
		addScaledVector: vi.fn().mockReturnThis()
	})),

	Color: vi.fn((color) => ({ color })),

	Clock: vi.fn(() => ({
		getDelta: vi.fn(() => 0.016)
	})),

	Object3D: vi.fn(() => ({
		uuid: 'test-uuid',
		userData: {},
		traverse: vi.fn(),
		castShadow: false,
		receiveShadow: false
	})),

	Mesh: vi.fn(() => ({
		...mockTHREE.Object3D(),
		geometry: { computeBoundsTree: vi.fn() },
		material: { dithering: false }
	})),

	Light: vi.fn(() => ({
		...mockTHREE.Object3D(),
		power: 0,
		position: { set: vi.fn() },
		castShadow: false,
		shadow: { map: null },
		visible: true
	})),

	Raycaster: vi.fn(() => ({
		setFromCamera: vi.fn(),
		intersectObjects: vi.fn(() => [])
	}))
}

// Mock the entire three module
vi.mock('@/three', () => ({
	default: mockTHREE,
	enableBVH: vi.fn()
}))
