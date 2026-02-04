import { useToast } from '@/composables/useToast'
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

		toast.info('Test message')
		toast.error('Test message')
		toast.success('Test message')
		toast.warning('Test message')

		expect(consoleSpy).toHaveBeenNthCalledWith(4, 'Toast instance not initialized')
	})

	it('should call addToast with correct parameters', () => {
		const { toast, setToastInstance } = useToast()
		setToastInstance(mockToastInstance)

		toast.success('Success message', { duration: 5000 })

		expect(mockToastInstance.addToast).toHaveBeenCalledWith({
			message: 'Success message',
			type: 'success',
			duration: 5000
		})
	})
})
