import { ref, type Ref } from 'vue'
import { registerSW } from 'virtual:pwa-register'

export interface PwaUpdateOptions {
	onNeedRefresh?: () => void
	onOfflineReady?: () => void
	onRegistered?: (registration: ServiceWorkerRegistration) => void
	onRegisterError?: (error: Error) => void
}

const needRefresh: Ref<boolean> = ref(false)
const offlineReady: Ref<boolean> = ref(false)

export const usePwaUpdate = (options: PwaUpdateOptions = {}) => {
	const updateSW = registerSW({
		onNeedRefresh() {
			needRefresh.value = true
			options.onNeedRefresh?.()
		},
		onOfflineReady() {
			offlineReady.value = true
			options.onOfflineReady?.()
		},
		onRegistered(registration) {
			options.onRegistered?.(registration)
		},
		onRegisterError(error) {
			console.error('PWA registration error:', error)
			options.onRegisterError?.(error)
		}
	})

	const update = async () => {
		await updateSW.update(true)
	}

	const dismiss = () => {
		needRefresh.value = false
	}

	return {
		needRefresh,
		offlineReady,
		update,
		dismiss
	}
}
