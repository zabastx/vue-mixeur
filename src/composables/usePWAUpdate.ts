import { ref, onMounted } from 'vue'

const needsUpdate = ref(false)
const isUpdateAvailable = ref(false)

export const usePWAUpdate = () => {
	const applyUpdate = () => {
		needsUpdate.value = false
		window.location.reload()
	}

	onMounted(() => {
		if (!import.meta.env.SSR) {
			import('virtual:pwa-register').then(({ registerSW }) => {
				registerSW({
					onNeedRefresh() {
						needsUpdate.value = true
						isUpdateAvailable.value = true
					},
					onOfflineReady() {
						console.log('App ready to work offline')
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
			})
		}
	})

	return {
		needsUpdate: Object.freeze(needsUpdate),
		isUpdateAvailable: Object.freeze(isUpdateAvailable),
		updateApp: applyUpdate
	}
}
