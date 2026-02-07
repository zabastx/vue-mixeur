import { reactive } from 'vue'

type DialogName = 'modelsLibrary' | 'textureLibrary' | 'about'

type DialogCallback = (...args: unknown[]) => unknown

export const openModals = reactive<Record<DialogName, boolean>>({
	about: false,
	modelsLibrary: false,
	textureLibrary: false
})

export const dialogCallbacks = reactive<Record<DialogName, DialogCallback | null>>({
	about: null,
	modelsLibrary: null,
	textureLibrary: null
})

export function useModals() {
	const isOpen = (name: DialogName) => openModals[name]

	function open(name: DialogName, cb?: DialogCallback) {
		openModals[name] = true
		dialogCallbacks[name] = cb ?? null
	}

	function close(name: DialogName) {
		openModals[name] = false
	}

	return {
		open,
		close,
		isOpen
	}
}
