import { afterEach, vi } from 'vitest'
import createGL from 'gl'
import { cleanup } from '@testing-library/vue'

afterEach(() => cleanup())

vi.mock('@vueuse/core', () => ({
	useEventListener: vi.fn()
}))

vi.mock('@/components/utils/MxIcon.vue', () => ({
	default: {
		template: '<span v-bind="$attrs" />',
		props: ['name']
	}
}))

vi.mock('@/components/utils/MxTooltip.vue', () => ({
	default: {
		template: '<slot name="default"></slot>',
		props: ['tooltipDisabled', 'tooltip', 'options']
	}
}))

vi.mock('three-viewport-gizmo', () => ({
	ViewportGizmo: vi.fn(() => ({
		render: vi.fn(),
		dispose: vi.fn(),
		camera: null,
		renderer: null
	}))
}))

vi.mock('three/addons/controls/OrbitControls.js', () => ({
	OrbitControls: vi.fn(() => ({
		update: vi.fn(),
		dispose: vi.fn(),
		target: { copy: vi.fn() },
		object: null
	}))
}))

const mockStoreReturnValue: Record<string, unknown> = {
	sceneChildren: [],
	selectedObject: null,
	selectObject: vi.fn(),
	objectVisibilityUpdate: vi.fn()
}

vi.mock('@/store/three', () => ({
	useThreeStore: vi.fn(() => mockStoreReturnValue)
}))

vi.mock('@/three', () => ({
	default: {
		Scene: vi.fn(() => ({
			children: [],
			add: vi.fn(),
			remove: vi.fn(),
			traverse: vi.fn(),
			getObjectByProperty: vi.fn(),
			addEventListener: vi.fn(),
			background: null
		})),
		Object3D: vi.fn(() => ({
			uuid: 'test-uuid',
			userData: {},
			traverse: vi.fn(),
			castShadow: false,
			receiveShadow: false,
			visible: true,
			children: []
		})),
		Mesh: vi.fn(() => ({
			uuid: 'mesh-uuid',
			userData: {},
			traverse: vi.fn(),
			castShadow: false,
			receiveShadow: false,
			visible: true,
			children: [],
			geometry: { computeBoundsTree: vi.fn() },
			material: { dithering: false }
		})),
		Light: vi.fn(() => ({
			uuid: 'light-uuid',
			userData: {},
			traverse: vi.fn(),
			castShadow: false,
			shadow: { map: null },
			visible: true,
			children: [],
			power: 0,
			position: { set: vi.fn() }
		})),
		Color: vi.fn((color) => ({ color })),
		Clock: vi.fn(() => ({ getDelta: vi.fn(() => 0.016) })),
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
		Raycaster: vi.fn(() => ({
			setFromCamera: vi.fn(),
			intersectObjects: vi.fn(() => [])
		}))
	},
	enableBVH: vi.fn()
}))

Object.defineProperty(globalThis.HTMLCanvasElement.prototype, 'getContext', {
	value: function (type: string) {
		if (type === 'webgl' || type === 'experimental-webgl') {
			const width = this.width || 800
			const height = this.height || 600
			return createGL(width, height)
		}
		return null
	}
})

class ImageStub {
	src = ''
	onload: (() => void) | null = null
	onerror: (() => void) | null = null
}

globalThis.Image = ImageStub as unknown as typeof Image

globalThis.ResizeObserver = class {
	observe() {}
	unobserve() {}
	disconnect() {}
}

globalThis.requestAnimationFrame = (cb: FrameRequestCallback) => setTimeout(cb, 0)
