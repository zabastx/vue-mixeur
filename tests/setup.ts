import { afterEach, vi } from 'vitest'
import createGL from 'gl'
import { cleanup } from '@testing-library/vue'

afterEach(() => cleanup())

vi.mock('@/components/base/ui/MxTooltip.vue', () => ({
	default: {
		template: '<slot name="default"></slot>',
		props: ['tooltipDisabled', 'tooltip', 'options']
	}
}))

Object.defineProperty(HTMLCanvasElement.prototype, 'getContext', {
	value(type: string, attrs?: object) {
		if (type === 'webgl' || type === 'webgl2' || type === 'experimental-webgl') {
			return createGL(800, 600, { preserveDrawingBuffer: true, ...(attrs as object) })
		}
		return null
	}
})
