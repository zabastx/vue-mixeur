import { registerSW } from 'virtual:pwa-register'
import { ref, onMounted } from 'vue'

const isUpdateAvailable = ref(false)

let reloadSW: (reloadPage?: boolean) => Promise<void>

export const usePWAUpdate = () => {
	const applyUpdate = async () => {
		if (reloadSW) {
			await reloadSW(true)
		} else {
			window.location.reload()
		}
		isUpdateAvailable.value = false
	}

	onMounted(() => {
		if (!import.meta.env.SSR) {
			reloadSW = registerSW({
				onNeedRefresh() {
					isUpdateAvailable.value = true
				},
				onRegistered(registration) {
					if (registration) {
						registration.update()
					}
				},
				onRegisterError(error) {
					console.error('SW registration error:', error)
				}
			})
		}
	})

	return {
		isUpdateAvailable,
		updateApp: applyUpdate
	}
}
