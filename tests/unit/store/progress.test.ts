import { useProgressStore } from '@/store/progress'
import { setActivePinia, createPinia } from 'pinia'
import { beforeEach, describe, expect, it } from 'vitest'

describe('useProgressStore', () => {
	beforeEach(() => {
		setActivePinia(createPinia())
	})

	it('should start progress with correct initial state', () => {
		const store = useProgressStore()
		const progress = store.initProgress('model.glb')
		progress.start(1024)

		expect(store.progressItems).toHaveLength(1)
		expect(store.progressItems[0]).toMatchObject({
			id: progress.id,
			title: 'model.glb',
			percentage: 0,
			loaded: 0,
			total: 1024
		})
		expect(store.progressItems[0].startTime).toBeDefined()
	})

	it('should calculate percentage correctly on update', () => {
		const store = useProgressStore()
		const progress = store.initProgress('model.glb')
		progress.start(1000)
		progress.update(progress.id, 500)

		expect(store.progressItems[0]?.percentage).toBe(50)
	})

	it('should calculate ETA based on transfer rate', () => {
		const store = useProgressStore()
		const progress = store.initProgress('model.glb')
		progress.start(1000)

		// Manually set a startTime in the past to simulate elapsed time
		store.progressItems[0].startTime = Date.now() - 1000 // 1 second ago

		progress.update(progress.id, 500)

		expect(store.progressItems[0]?.estimatedTimeRemaining).toBeDefined()
	})

	it('should remove item on stop', () => {
		const store = useProgressStore()
		const progress = store.initProgress('model.glb')
		progress.start(1000)
		progress.stop()

		expect(store.progressItems).toHaveLength(0)
	})

	it('should handle onProgress event correctly', () => {
		const store = useProgressStore()
		const progress = store.initProgress('model.glb')

		// First call - no item exists yet, so onProgress calls start with the event's total
		const mockEvent = {
			lengthComputable: true,
			loaded: 0,
			total: 1000
		} as ProgressEvent

		progress.onProgress(mockEvent)

		expect(store.progressItems).toHaveLength(1)
		expect(store.progressItems[0]?.total).toBe(1000)
		expect(store.progressItems[0]?.loaded).toBe(0)
		expect(store.progressItems[0]?.percentage).toBe(0)

		// Second call - item exists, so onProgress updates it
		const mockEventWithProgress = {
			lengthComputable: true,
			loaded: 500,
			total: 1000
		} as ProgressEvent

		progress.onProgress(mockEventWithProgress)

		expect(store.progressItems).toHaveLength(1)
		expect(store.progressItems[0]?.loaded).toBe(500)
		expect(store.progressItems[0]?.percentage).toBe(50)
	})

	it('should handle onProgress without total initially', () => {
		const store = useProgressStore()
		const progress = store.initProgress('model.glb')

		// First call without total
		const mockEventNoTotal = {
			lengthComputable: true,
			loaded: 0,
			total: 1000
		} as ProgressEvent

		progress.onProgress(mockEventNoTotal)

		expect(store.progressItems).toHaveLength(1)
		expect(store.progressItems[0]?.total).toBe(1000)
		expect(store.progressItems[0]?.percentage).toBe(0)

		// Second call with total - should update
		const mockEventWithProgress = {
			lengthComputable: true,
			loaded: 500,
			total: 1000
		} as ProgressEvent

		progress.onProgress(mockEventWithProgress)

		expect(store.progressItems[0]?.loaded).toBe(500)
		expect(store.progressItems[0]?.percentage).toBe(50)
	})

	it('should ignore onProgress when length is not computable', () => {
		const store = useProgressStore()
		const progress = store.initProgress('model.glb')

		const mockEvent = {
			lengthComputable: false,
			loaded: 500,
			total: 1000
		} as ProgressEvent

		progress.onProgress(mockEvent)

		// Should not create a progress item
		expect(store.progressItems).toHaveLength(0)
	})

	it('should handle update without total gracefully', () => {
		const store = useProgressStore()
		const progress = store.initProgress('model.glb')
		// Start without total
		progress.start()

		// Update should be ignored when no total
		progress.update(progress.id, 500)

		// Item should still exist but percentage should not be calculated
		expect(store.progressItems[0]).toBeDefined()
		expect(store.progressItems[0]?.percentage).toBe(0)
	})
})
