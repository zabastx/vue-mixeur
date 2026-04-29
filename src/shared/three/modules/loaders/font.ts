import { useProgressStore } from '@/app/model/progress'
import { useToast } from '@/shared/lib/toast'
import { FontLoader } from 'three/examples/jsm/Addons.js'

const toast = useToast()

const fontLoader = new FontLoader()

export async function loadFont(font: StdFontName | (string & {})) {
	const progressStore = useProgressStore()
	const progressItem = progressStore.initProgress(font)

	try {
		const url = defaultFontUrls.get(font) || font
		const res = await fontLoader.loadAsync(url, progressItem.onProgress)
		return res
	} catch (err) {
		const error = err as Error
		toast.add({ type: 'error', message: 'Error when loading font' })
		if (import.meta.env.DEV) console.error('loadFont Error\n', error.name, error.message)
		return null
	} finally {
		progressItem.stop()
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
