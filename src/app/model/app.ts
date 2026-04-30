import { useEventListener, useKeyModifier } from '@vueuse/core'
import { acceptHMRUpdate, defineStore } from 'pinia'
import { ref, type ShallowRef } from 'vue'
import { useThreeStore } from './three'
import { useControlsStore } from './controls'
import THREE from '@/shared/three'
import { useCameraStore } from './camera'

export const useAppStore = defineStore('app', () => {
	const showStatusBar = ref(true)
	const showToolSettings = ref(true)
	const showToolbar = ref(true)

	const pointerOnCanvas = ref(false)
	const isCtrlDown = useKeyModifier('Control')
	const isShiftDown = useKeyModifier('Shift')

	function initListeners(canvas: ShallowRef<HTMLCanvasElement | null>) {
		useEventListener(canvas, 'pointerenter', () => (pointerOnCanvas.value = true))
		useEventListener(canvas, 'pointerleave', () => (pointerOnCanvas.value = false))

		useEventListener(canvas, 'pointerdown', (e) => {
			const { controls } = useControlsStore()
			if (e.button === THREE.MOUSE.MIDDLE && controls) {
				controls.screenSpacePanning = !e.ctrlKey
			}
		})

		const ignoredElements = ['input', 'textarea', 'select']

		useEventListener(window, 'keydown', (e) => {
			const sceneStore = useThreeStore()

			if (
				e.target instanceof HTMLElement &&
				ignoredElements.includes(e.target.tagName.toLowerCase())
			) {
				e.stopImmediatePropagation()
				return
			}

			if (!pointerOnCanvas.value) return

			switch (e.code) {
				case 'Delete':
					e.preventDefault()
					if (sceneStore.selectedObject instanceof THREE.Object3D) {
						sceneStore.deleteFromScene(sceneStore.selectedObject.uuid)
					}
					break

				case 'KeyD':
					e.preventDefault()
					if (sceneStore.selectedObject instanceof THREE.Object3D && e.shiftKey) {
						sceneStore.cloneObject(sceneStore.selectedObject.uuid)
					}
					break

				case 'KeyT':
					e.preventDefault()
					showToolbar.value = !showToolbar.value
					break
			}
		})

		// Moves perspective camera on scroll instead of zoom
		useEventListener(canvas, 'wheel', (event) => {
			event.preventDefault()

			const { activeCamera } = useCameraStore()
			const { controls } = useControlsStore()

			if (!controls) return
			const delta = event.deltaY * -0.01
			if (activeCamera instanceof THREE.PerspectiveCamera) {
				let dollyScale = 1.2

				if (isCtrlDown.value) dollyScale = 1.3
				if (isShiftDown.value) dollyScale = 1.05

				if (delta < 0) controls.dollyIn(dollyScale)
				if (delta > 0) controls.dollyOut(dollyScale)
			} else if (activeCamera instanceof THREE.OrthographicCamera) {
				const zoomFactor = 1 + delta * 0.1
				activeCamera.zoom *= zoomFactor
				activeCamera.updateProjectionMatrix()
			}
			controls.update()
		})
	}

	return {
		pointerOnCanvas,
		isCtrlDown,
		isShiftDown,
		initListeners,
		showStatusBar,
		showToolSettings,
		showToolbar
	}
})

if (import.meta.hot) {
	import.meta.hot.accept(acceptHMRUpdate(useAppStore, import.meta.hot))
}
