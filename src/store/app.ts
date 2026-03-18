import { useEventListener, useKeyModifier } from '@vueuse/core'
import { acceptHMRUpdate, defineStore } from 'pinia'
import { ref, type ShallowRef } from 'vue'
import { useThreeStore } from './three'
import { useControlsStore } from './controls'
import THREE from '@/three'

export const useAppStore = defineStore('app', () => {
	const pointerOnCanvas = ref(false)
	const sceneStore = useThreeStore()
	const controlsStore = useControlsStore()

	const isCtrlDown = useKeyModifier('Control')
	const isShiftDown = useKeyModifier('Shift')

	function useHotKeys(canvas: ShallowRef<HTMLCanvasElement | null>) {
		useEventListener(canvas, 'pointerenter', () => (pointerOnCanvas.value = true))
		useEventListener(canvas, 'pointerleave', () => (pointerOnCanvas.value = false))

		useEventListener(canvas, 'pointerdown', (e) => {
			if (e.button === THREE.MOUSE.MIDDLE && sceneStore.controls) {
				sceneStore.controls.screenSpacePanning = !e.ctrlKey
			}
		})

		useEventListener(window, 'keydown', (e) => {
			if (!pointerOnCanvas.value || !controlsStore.transformControls) return

			switch (e.code) {
				case 'Numpad5': // Perspective / Orthographic camera toggle
					sceneStore.switchCamera()
					break

				case 'Numpad1': // Front / Back view
					e.preventDefault()
					setView({ z: 1, invert: e.ctrlKey })
					break
				case 'Numpad3': // Right / Left view
					e.preventDefault()
					setView({ x: 1, invert: e.ctrlKey })
					break
				case 'Numpad7': // Top / Bottom view
					e.preventDefault()
					setView({ y: 1, invert: e.ctrlKey })
					break

				case 'KeyG':
					controlsStore.currentTransformMode = 'translate'
					break
				case 'KeyR':
					controlsStore.currentTransformMode = 'rotate'
					break
				case 'KeyS':
					controlsStore.currentTransformMode = 'scale'
					break

				case 'Delete':
					if (sceneStore.selectedObject instanceof THREE.Object3D) {
						sceneStore.deleteFromScene(sceneStore.selectedObject)
					}
					break
			}
		})

		// Moves perspective camera on scroll instead of zoom
		useEventListener(canvas, 'wheel', (event) => {
			if (event.ctrlKey) event.preventDefault()
			const { activeCamera, controls } = sceneStore
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

	function setView({
		x = 0,
		y = 0,
		z = 0,
		invert = false
	}: {
		x?: number
		y?: number
		z?: number
		invert?: boolean
	}) {
		const { activeCamera, controls } = sceneStore
		if (!controls || !activeCamera) return
		const dir = invert ? -1 : 1
		const distance = activeCamera.position.distanceTo(controls.target)
		const newPos = new THREE.Vector3(x * dir, y * dir, z * dir).multiplyScalar(distance)
		activeCamera.position.copy(controls.target).add(newPos)
		activeCamera.up.set(0, 1, 0)
		activeCamera.lookAt(controls.target)
		controls.update()
	}

	const showStatusBar = ref(true)

	return { pointerOnCanvas, isCtrlDown, isShiftDown, useHotKeys, showStatusBar, setView }
})

if (import.meta.hot) {
	import.meta.hot.accept(acceptHMRUpdate(useAppStore, import.meta.hot))
}
