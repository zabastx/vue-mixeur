import THREE from '@/three'
import Stats from 'three/examples/jsm/libs/stats.module.js'
import { reactive } from 'vue'

export function useStats() {
	const stats = new Stats()
	stats.dom.style.position = 'absolute'
	stats.dom.style.top = 'initial'
	stats.dom.style.bottom = '0px'
	const monitor = reactive({
		memory: '',
		geometries: 0,
		textures: 0
	})

	function setFPSCounter(container: HTMLElement | null) {
		if (container) {
			container.appendChild(stats.dom)
		}
	}

	let passedTime = 0
	const clock = new THREE.Clock()

	function updateMonitor(renderer: THREE.WebGLRenderer) {
		stats.update()
		const delta = clock.getDelta()
		passedTime += delta

		if (passedTime < 1) return

		if ('memory' in performance) {
			// @ts-expect-error Performance.memory is only available in Chrome
			const used = (performance.memory.usedJSHeapSize / 1048576).toFixed(2)
			monitor.memory = used
		}

		const gpu = renderer.info.memory
		monitor.geometries = gpu.geometries
		monitor.textures = gpu.textures
		passedTime = 0
	}

	return { monitor, setFPSCounter, stats, updateMonitor }
}
