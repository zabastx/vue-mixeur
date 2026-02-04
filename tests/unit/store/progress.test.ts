import { useProgressStore } from '@/store/progress'
import { setActivePinia, createPinia } from 'pinia'
import { beforeEach, describe, expect, it } from 'vitest'

describe('useProgressStore', () => {
	beforeEach(() => {
		setActivePinia(createPinia())
	})

	it('should start loading with correct initial state', () => {
		const store = useProgressStore()
		store.startLoading('test-1', 'model.glb', 1024)

		expect(store.loadingItems).toHaveLength(1)
		expect(store.loadingItems[0]).toMatchObject({
			id: 'test-1',
			filename: 'model.glb',
			percentage: 0,
			loaded: 0,
			total: 1024
		})
	})

	it('should calculate percentage correctly on update', () => {
		const store = useProgressStore()
		store.startLoading('test-1', 'model.glb', 1000)
		store.updateProgress('test-1', 500)

		expect(store.loadingItems[0]?.percentage).toBe(50)
	})

	it('should calculate ETA based on transfer rate', () => {
		const store = useProgressStore()
		store.startLoading('test-1', 'model.glb', 1000)
		// Simulate time passing and progress
		store.updateProgress('test-1', 500)

		expect(store.loadingItems[0]?.estimatedTimeRemaining).toBeDefined()
	})

	it('should remove item on finish', () => {
		const store = useProgressStore()
		store.startLoading('test-1', 'model.glb', 1000)
		store.finishLoading('test-1')

		expect(store.loadingItems).toHaveLength(0)
	})
})
