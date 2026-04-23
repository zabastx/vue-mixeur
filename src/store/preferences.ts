import { useToast } from '@/composables/toast'
import { acceptHMRUpdate, defineStore } from 'pinia'
import { computed, shallowRef, triggerRef } from 'vue'

export const usePreferencesStore = defineStore('preferences', () => {
	const computedStyle = computed(() => getComputedStyle(document.documentElement))

	const customThemeVars = shallowRef<Record<string, string>>({})
	const defaultVars = shallowRef<Record<string, string>>({})

	const getPropertyValue = (key: string) => {
		const value = customThemeVars.value[key]
		return value ?? computedStyle.value.getPropertyValue(key)
	}

	const setProperty = (key: string, val: string | number) => {
		const newVal = val.toString()
		if (!defaultVars.value[key]) {
			defaultVars.value[key] = computedStyle.value.getPropertyValue(key)
		}
		document.documentElement.style.setProperty(key, newVal)
		customThemeVars.value[key] = newVal
		triggerRef(customThemeVars)
		localStorage.setItem('theme-vars', JSON.stringify(customThemeVars.value))
	}

	const reset = () => {
		customThemeVars.value = {}
		localStorage.removeItem('theme-vars')
		triggerRef(customThemeVars)
		Object.entries<string>(defaultVars.value).forEach(([key, val]) => {
			setProperty(key, val)
		})
	}

	const init = () => {
		const preset = localStorage.getItem('theme-vars')
		if (!preset) return
		try {
			const data = JSON.parse(preset)
			customThemeVars.value = data
			Object.entries<string>(data).forEach(([key, val]) => {
				if (getPropertyValue(key)) {
					setProperty(key, val)
				}
			})
		} catch (e) {
			const error = e as Error
			const toast = useToast()
			toast.add({
				type: 'error',
				message: 'Error parsing theme settings'
			})
			if (import.meta.env.DEV) console.warn('preferences init error:\n', error)
		}
	}

	return { getPropertyValue, setProperty, init, reset }
})

if (import.meta.hot) {
	import.meta.hot.accept(acceptHMRUpdate(usePreferencesStore, import.meta.hot))
}
