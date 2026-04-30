import { acceptHMRUpdate, defineStore } from 'pinia'
import { ref } from 'vue'

export const useAppStore = defineStore('app', () => {
	const showStatusBar = ref(true)
	const showToolSettings = ref(true)
	const showToolbar = ref(true)

	return {
		showStatusBar,
		showToolSettings,
		showToolbar
	}
})

if (import.meta.hot) {
	import.meta.hot.accept(acceptHMRUpdate(useAppStore, import.meta.hot))
}
