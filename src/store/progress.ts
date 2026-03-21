import { acceptHMRUpdate, defineStore } from 'pinia'
import { ref } from 'vue'

export interface ProgressItem {
	id: string
	title: string
	percentage?: number
	loaded: number
	total?: number
	startTime: number
	estimatedTimeRemaining?: number
}

export const useProgressStore = defineStore('progress', () => {
	const progressItems = ref<ProgressItem[]>([])

	function initProgress(title: string) {
		const id = crypto.randomUUID()
		let idx: number | undefined

		const start = (total?: number) => {
			idx =
				progressItems.value.push({
					id,
					title,
					percentage: 0,
					loaded: 0,
					total,
					startTime: Date.now()
				}) - 1
		}

		const update = (id: string, loaded: number) => {
			const item = progressItems.value.find((p) => p.id === id)
			if (!item || !item.total) return

			item.loaded = loaded
			item.percentage = (loaded / item.total) * 100

			// Calculate ETA
			const elapsed = Date.now() - item.startTime
			if (elapsed > 0 && loaded > 0) {
				const rate = loaded / elapsed // bytes per millisecond
				const remaining = item.total - loaded
				item.estimatedTimeRemaining = remaining / rate
			}
		}

		const stop = () => {
			if (idx === undefined) return
			progressItems.value.splice(idx, 1)
		}

		const onProgress = (e: ProgressEvent) => {
			if (e.lengthComputable) {
				const item = progressItems.value.find((p: ProgressItem) => p.id === id)

				if (!item) return start(e.total)

				update(item.id, e.loaded)
			}
		}

		return {
			id,
			start,
			update,
			stop,
			onProgress
		}
	}

	return {
		progressItems,
		initProgress
	}
})

if (import.meta.hot) {
	import.meta.hot.accept(acceptHMRUpdate(useProgressStore, import.meta.hot))
}
