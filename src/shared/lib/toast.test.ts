import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { cleanup } from '@testing-library/vue'
import { nextTick } from 'vue'
import { useToast } from './toast'

describe('useToast', () => {
	beforeEach(() => {
		const { clear } = useToast()
		clear()
	})

	afterEach(() => {
		cleanup()
	})

	describe('add', () => {
		it('should add toast with required message only', async () => {
			const { add, toasts } = useToast()

			const id = add({ message: 'Simple message' })

			await nextTick()

			expect(id).toBe('toast-1')
			expect(toasts.value).toHaveLength(1)
			expect(toasts.value[0]).toMatchObject({
				id: 'toast-1',
				message: 'Simple message',
				type: 'info',
				duration: 5000,
				open: true
			})
		})

		it('should add toast with all options', async () => {
			const { add, toasts } = useToast()

			const id = add({
				message: 'Full toast message',
				title: 'Title',
				type: 'success',
				duration: 10000
			})

			await nextTick()

			expect(id).toBe('toast-1')
			expect(toasts.value[0]).toMatchObject({
				id: 'toast-1',
				title: 'Title',
				message: 'Full toast message',
				type: 'success',
				duration: 10000
			})
		})

		it('should support all toast types', async () => {
			const { add, toasts } = useToast()

			add({ message: 'Info message', type: 'info' })
			add({ message: 'Success message', type: 'success' })
			add({ message: 'Warning message', type: 'warning' })
			add({ message: 'Error message', type: 'error' })

			await nextTick()

			expect(toasts.value).toHaveLength(4)
			expect(toasts.value[0]?.type).toBe('info')
			expect(toasts.value[1]?.type).toBe('success')
			expect(toasts.value[2]?.type).toBe('warning')
			expect(toasts.value[3]?.type).toBe('error')
		})

		it('should return unique ids for multiple toasts', async () => {
			const { add } = useToast()

			const id1 = add({ message: 'First' })
			const id2 = add({ message: 'Second' })
			const id3 = add({ message: 'Third' })

			await nextTick()

			expect(id1).toBe('toast-1')
			expect(id2).toBe('toast-2')
			expect(id3).toBe('toast-3')
		})

		it('should use default type when not specified', async () => {
			const { add, toasts } = useToast()

			add({ message: 'Default type toast' })

			await nextTick()

			expect(toasts.value[0]?.type).toBe('info')
		})

		it('should handle duration of 0 for persistent toasts', async () => {
			const { add, toasts } = useToast()

			add({ message: 'Persistent toast', duration: 0 })

			await nextTick()

			expect(toasts.value[0]?.duration).toBe(0)
		})
	})

	describe('remove', () => {
		it('should remove existing toast by id', async () => {
			const { add, remove, toasts } = useToast()

			add({ message: 'First toast' })
			const id2 = add({ message: 'Second toast' })
			add({ message: 'Third toast' })

			await nextTick()
			expect(toasts.value).toHaveLength(3)

			remove(id2)

			await nextTick()
			expect(toasts.value).toHaveLength(2)
			expect(toasts.value.map((t) => t.message)).toEqual(['First toast', 'Third toast'])
		})

		it('should handle removing non-existent toast id', async () => {
			const { add, remove, toasts } = useToast()

			add({ message: 'Only toast' })

			await nextTick()

			remove('non-existent-id')

			await nextTick()
			expect(toasts.value).toHaveLength(1)
		})
	})

	describe('clear', () => {
		it('should clear all toasts', async () => {
			const { add, clear, toasts } = useToast()

			add({ message: 'First toast' })
			add({ message: 'Second toast' })
			add({ message: 'Third toast' })

			await nextTick()
			expect(toasts.value).toHaveLength(3)

			clear()

			await nextTick()
			expect(toasts.value).toHaveLength(0)
		})

		it('should handle clearing when no toasts exist', async () => {
			const { clear, toasts } = useToast()

			clear()

			await nextTick()
			expect(toasts.value).toHaveLength(0)
		})

		it('should allow adding toasts after clear', async () => {
			const { add, clear, toasts } = useToast()

			add({ message: 'Before clear' })

			await nextTick()
			expect(toasts.value).toHaveLength(1)

			clear()

			await nextTick()

			add({ message: 'After clear' })

			await nextTick()
			expect(toasts.value).toHaveLength(1)
			expect(toasts.value[0]?.message).toBe('After clear')
		})

		it('should reset counter when cleared', async () => {
			const { add, clear } = useToast()

			const id1 = add({ message: 'First' })
			expect(id1).toBe('toast-1')

			clear()

			const id2 = add({ message: 'Second' })
			expect(id2).toBe('toast-1') // Counter reset, starts from 1 again
		})
	})

	describe('reactivity', () => {
		it('should provide reactive toasts ref', async () => {
			const { add, toasts } = useToast()

			expect(toasts.value).toHaveLength(0)

			add({ message: 'Test' })

			await nextTick()
			expect(toasts.value).toHaveLength(1)
		})

		it('should share state across multiple useToast calls', async () => {
			const { add, clear } = useToast()
			const { toasts } = useToast()

			add({ message: 'Shared state test' })

			await nextTick()
			expect(toasts.value).toHaveLength(1)

			clear()

			await nextTick()
			expect(toasts.value).toHaveLength(0)
		})
	})

	describe('integration scenarios', () => {
		it('should handle typical usage flow', async () => {
			const { add, remove, clear, toasts } = useToast()

			// User performs action - success notification
			const successId = add({
				message: 'File saved successfully',
				type: 'success'
			})

			// Another action with warning
			add({
				message: 'Low disk space',
				type: 'warning',
				duration: 10000
			})

			await nextTick()

			expect(toasts.value).toHaveLength(2)

			// User dismisses first toast
			remove(successId)

			await nextTick()

			expect(toasts.value).toHaveLength(1)
			expect(toasts.value[0]?.type).toBe('warning')

			// Clear all on logout
			clear()

			await nextTick()

			expect(toasts.value).toHaveLength(0)
		})

		it('should handle error notification flow', async () => {
			const { add, remove, toasts } = useToast()

			// Simulate error with persistent duration
			const errorId = add({
				title: 'Error',
				message: 'Failed to load model',
				type: 'error',
				duration: 0
			})

			await nextTick()

			expect(toasts.value).toHaveLength(1)
			expect(toasts.value[0]?.duration).toBe(0)

			// User dismisses error
			remove(errorId)

			await nextTick()

			expect(toasts.value).toHaveLength(0)
		})

		it('should handle rapid toast additions', async () => {
			const { add, clear, toasts } = useToast()

			// Simulate rapid events
			for (let i = 0; i < 10; i++) {
				add({ message: `Toast ${i}` })
			}

			await nextTick()

			expect(toasts.value).toHaveLength(10)

			// Clear all
			clear()

			await nextTick()

			expect(toasts.value).toHaveLength(0)
		})
	})
})
