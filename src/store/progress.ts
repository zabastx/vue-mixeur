import { acceptHMRUpdate, defineStore } from 'pinia'
import { ref } from 'vue'

export interface LoadingProgress {
	id: string
	filename: string
	percentage: number
	loaded: number
	total: number
	startTime: number
	estimatedTimeRemaining?: number
}

export const useProgressStore = defineStore('progress', () => {
	const loadingItems = ref<LoadingProgress[]>([])

	function startLoading(id: string, filename: string, total: number) {
		const progress: LoadingProgress = {
			id,
			filename,
			percentage: 0,
			loaded: 0,
			total,
			startTime: Date.now()
		}
		loadingItems.value.push(progress)
	}

	function updateProgress(id: string, loaded: number) {
		const item = loadingItems.value.find((p) => p.id === id)
		if (!item) return

		item.loaded = loaded
		item.percentage = (loaded / item.total) * 100

		// Calculate ETA
		const elapsed = Date.now() - item.startTime
		const rate = loaded / elapsed // bytes per millisecond
		const remaining = item.total - loaded
		item.estimatedTimeRemaining = remaining / rate
	}

	function finishLoading(id: string) {
		const index = loadingItems.value.findIndex((p) => p.id === id)
		if (index !== -1) {
			loadingItems.value.splice(index, 1)
		}
	}

	function getActiveLoadings() {
		return loadingItems.value
	}

	return {
		loadingItems,
		startLoading,
		updateProgress,
		finishLoading,
		getActiveLoadings
	}
})

if (import.meta.hot) {
	import.meta.hot.accept(acceptHMRUpdate(useProgressStore, import.meta.hot))
}
