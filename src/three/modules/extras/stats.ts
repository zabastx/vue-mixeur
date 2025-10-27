import Stats from 'three/examples/jsm/libs/stats.module.js'
import { ref } from 'vue'

export function useStats() {
	const stats = new Stats()
	stats.dom.style.position = 'absolute'
	stats.dom.style.top = 'initial'
	stats.dom.style.bottom = '0px'
	const monitor = ref({
		memory: '',
		geometries: 0,
		textures: 0
	})

	function initStats(container: HTMLElement | null) {
		if (container) {
			container.appendChild(stats.dom)
		}
	}

	return { monitor, initStats, stats }
}
