import { useProgressStore, type LoadingProgress } from '@/store/progress'
import { useToast } from '@/composables/useToast'

export async function loadFont(fontName: StdFontName) {
	const progressStore = useProgressStore()
	const loadingId = `font-${Date.now()}-${Math.random().toString(36).slice(2)}`
	const { FontLoader } = await import('three/examples/jsm/Addons.js')
	const fontLoader = new FontLoader()
	fontLoader.setPath('/fonts/')

	try {
		const res = await fontLoader.loadAsync(`${fontName}.typeface.json`, onProgress)
		return res
	} catch (err) {
		const error = err as Error
		useToast().toast.error('Error when loading world texture')
		if (import.meta.env.DEV) console.error(error.name, error.message)
		return null
	} finally {
		progressStore.finishLoading(loadingId)
	}

	function onProgress(e: ProgressEvent) {
		if (e.lengthComputable) {
			if (progressStore.loadingItems.find((p: LoadingProgress) => p.id === loadingId)) {
				progressStore.updateProgress(loadingId, e.loaded)
			} else {
				progressStore.startLoading(loadingId, `${fontName}.typeface.json`, e.total)
			}
		}
	}
}

export type StdFontName =
	| 'helvetiker_regular'
	| 'helvetiker_bold'
	| 'optimer_regular'
	| 'optimer_bold'
	| 'gentilis_regular'
	| 'gentilis_bold'
