import { useToast } from '@/composables/toast'
import { beforeEach, describe, expect, it, vi } from 'vitest'

describe('useToast', () => {
	const mockToastInstance = {
		addToast: vi.fn(() => 'toast-id'),
		removeToast: vi.fn(),
		clearAllToasts: vi.fn()
	}

	beforeEach(() => {
		vi.clearAllMocks()
	})

	it('should warn when toast instance not set', () => {
		const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
		const { toast } = useToast()

		toast.add({ type: 'info', message: 'Test message' })
		toast.add({ type: 'error', message: 'Test message' })
		toast.add({ type: 'success', message: 'Test message' })
		toast.add({ type: 'warning', message: 'Test message' })

		expect(consoleSpy).toHaveBeenCalledTimes(4)
		expect(consoleSpy).toHaveBeenCalledWith('Toast instance not initialized')
	})

	it('should call addToast with correct parameters', () => {
		const { toast, setToastInstance } = useToast()
		setToastInstance(mockToastInstance)

		toast.add({ type: 'success', message: 'Success message', duration: 5000 })

		expect(mockToastInstance.addToast).toHaveBeenCalledWith({
			type: 'success',
			message: 'Success message',
			duration: 5000
		})
	})
})
