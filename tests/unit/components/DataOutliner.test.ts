import DataOutliner from '@/components/data/outliner/DataOutliner.vue'
import { render, screen } from '@testing-library/vue'
import { describe, expect, it, vi, beforeEach } from 'vitest'
import { ref } from 'vue'

// Mock store return values - using refs for reactivity
const mockSceneChildren = ref<unknown[]>([])
const mockSelectedObject = ref<unknown | null>(null)
let mockObjectVisibilityUpdate = vi.fn()

// Setup before all tests
vi.mock('@/store/three', () => ({
	useThreeStore: vi.fn(() => ({
		sceneChildren: mockSceneChildren.value,
		selectedObject: mockSelectedObject.value,
		objectVisibilityUpdate: mockObjectVisibilityUpdate
	}))
}))

describe('DataOutliner', () => {
	beforeEach(() => {
		vi.resetAllMocks()
		mockSceneChildren.value = []
		mockSelectedObject.value = null
		mockObjectVisibilityUpdate = vi.fn()
	})

	it('renders outliner with header and scene collection', () => {
		render(DataOutliner)

		expect(screen.getByText('Outliner')).toBeTruthy()
		expect(screen.getByText('Scene Collection')).toBeTruthy()
	})

	it('displays scene objects in the tree', () => {
		const mesh = {
			uuid: 'mesh-uuid-1',
			name: 'TestMesh',
			type: 'Mesh',
			visible: true,
			userData: { isHelper: false },
			children: []
		}
		mockSceneChildren.value = [mesh]

		render(DataOutliner)

		expect(screen.getByText('TestMesh')).toBeTruthy()
	})

	it('filters out helper objects', () => {
		const mesh = {
			uuid: 'mesh-uuid-1',
			name: 'TestMesh',
			type: 'Mesh',
			visible: true,
			userData: { isHelper: true },
			children: []
		}
		mockSceneChildren.value = [mesh]

		render(DataOutliner)

		expect(screen.queryByText('TestMesh')).toBeFalsy()
	})

	it('highlights selected object', () => {
		const mesh = {
			uuid: 'mesh-uuid-1',
			name: 'TestMesh',
			type: 'Mesh',
			visible: true,
			userData: { isHelper: false },
			children: []
		}
		mockSceneChildren.value = [mesh]
		// Set selectedObject to trigger the watch in the component
		mockSelectedObject.value = mesh

		render(DataOutliner)

		// The item should have the highlight class when selected
		const treeItem = screen.getByText('TestMesh').closest('li')
		expect(treeItem).toBeTruthy()
		expect(treeItem?.className).toContain('bg-outliner-active-highlight')
	})

	it('calls objectVisibilityUpdate when visibility checkbox is clicked', () => {
		const mesh = {
			uuid: 'mesh-uuid-1',
			name: 'TestMesh',
			type: 'Mesh',
			visible: true,
			userData: { isHelper: false },
			children: []
		}
		mockSceneChildren.value = [mesh]
		mockObjectVisibilityUpdate = vi.fn()

		render(DataOutliner)

		// Find and click the visibility checkbox
		const checkbox = screen.getByRole('checkbox')
		checkbox.click()

		expect(mockObjectVisibilityUpdate).toHaveBeenCalledWith('mesh-uuid-1', false)
	})

	it('displays nested objects with parent and child', () => {
		const child = {
			uuid: 'child-uuid-1',
			name: 'ChildMesh',
			type: 'Mesh',
			visible: true,
			userData: { isHelper: false },
			children: []
		}

		const parent = {
			uuid: 'parent-uuid-1',
			name: 'ParentGroup',
			type: 'Group',
			visible: true,
			userData: { isHelper: false },
			children: [child]
		}
		mockSceneChildren.value = [parent]

		render(DataOutliner)

		expect(screen.getByText('ParentGroup')).toBeTruthy()
		// Parent should have expand/collapse toggle since it has children
		const toggleButton = screen
			.getByText('ParentGroup')
			.closest('li')
			?.querySelector('[data-toggle]')
		expect(toggleButton).toBeTruthy()
	})
})
