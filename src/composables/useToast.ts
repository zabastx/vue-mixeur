import { ref } from 'vue'
import type { ToastOptions } from '@/components/utils/MxToast.vue'

// Global toast state
interface ToastInstance {
	addToast: (options: ToastOptions) => string
	removeToast: (id: string) => void
	clearAllToasts: () => void
}

const toastInstance = ref<ToastInstance | null>(null)

export const useToast = () => {
	const setToastInstance = (instance: ToastInstance) => {
		toastInstance.value = instance
	}

	const toast = {
		add: (options: ToastOptions) => {
			if (!toastInstance.value) {
				console.warn('Toast instance not initialized')
				return
			}
			return toastInstance.value.addToast(options)
		},

		remove: (id: string) => {
			if (!toastInstance.value) {
				console.warn('Toast instance not initialized')
				return
			}
			toastInstance.value.removeToast(id)
		},

		clear: () => {
			if (!toastInstance.value) {
				console.warn('Toast instance not initialized')
				return
			}
			toastInstance.value.clearAllToasts()
		}
	}

	return {
		toast,
		setToastInstance
	}
}
