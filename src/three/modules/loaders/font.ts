import { useProgressStore, type LoadingProgress } from '@/store/progress'
import { useToast } from '@/composables/useToast'
import { FontLoader } from 'three/examples/jsm/Addons.js'

export async function loadFont(font: StdFontName | (string & {})) {
	const progressStore = useProgressStore()
	const loadingId = `font-${Date.now()}-${Math.random().toString(36).slice(2)}`
	const fontLoader = new FontLoader()

	try {
		const url = defaultFontUrls.get(font) || font
		const res = await fontLoader.loadAsync(url, onProgress)
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
				progressStore.startLoading(loadingId, font, e.total)
			}
		}
	}
}

const defaultFontUrls = new Map<string, string>([
	['gentilis-bold', '/fonts/gentilis_bold.typeface.json'],
	['gentilis-regular', '/fonts/gentilis_regular.typeface.json'],
	['helvetiker-regular', '/fonts/helvetiker_regular.typeface.json'],
	['helvetiker-bold', '/fonts/helvetiker_bold.typeface.json'],
	['optimer-regular', '/fonts/optimer_regular.typeface.json'],
	['optimer-bold', '/fonts/optimer_bold.typeface.json']
])

export const defaultFontsList: FontsListOption[] = [
	{
		value: 'helvetiker-regular',
		label: 'Helvetiker Regular'
	},
	{
		value: 'optimer-regular',
		label: 'Optimer Regular'
	},
	{
		value: 'gentilis-regular',
		label: 'Gentilis Regular'
	},
	{
		value: 'helvetiker-bold',
		label: 'Helvetiker Bold'
	},
	{
		value: 'optimer-bold',
		label: 'Optimer Bold'
	},
	{
		value: 'gentilis-bold',
		label: 'Gentilis Bold'
	}
] as const

export type StdFontName =
	| 'helvetiker-regular'
	| 'helvetiker-bold'
	| 'optimer-regular'
	| 'optimer-bold'
	| 'gentilis-regular'
	| 'gentilis-bold'

export interface FontsListOption {
	value: StdFontName
	label: string
}
