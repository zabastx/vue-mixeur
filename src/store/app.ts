import { useEventListener } from '@vueuse/core'
import { defineStore } from 'pinia'
import { ref, type ShallowRef } from 'vue'
import { useThreeStore } from './three'
import THREE from '@/three'

export const useAppStore = defineStore('app', () => {
	const pointerOnCanvas = ref(false)
	const isCtrlDown = ref(false)
	const isShiftDown = ref(false)

	function useHotKeys(canvas: ShallowRef<HTMLCanvasElement | null>) {
		const sceneStore = useThreeStore()

		useEventListener(canvas, 'pointerenter', () => (pointerOnCanvas.value = true))
		useEventListener(canvas, 'pointerleave', () => (pointerOnCanvas.value = false))

		useEventListener(canvas, 'pointerdown', (e) => {
			if (e.button === THREE.MOUSE.MIDDLE && sceneStore.controls) {
				sceneStore.controls.screenSpacePanning = !e.ctrlKey
			}
		})

		useEventListener(window, 'keydown', (e) => {
			isCtrlDown.value = e.ctrlKey
			isShiftDown.value = e.shiftKey

			if (!pointerOnCanvas.value) return

			switch (e.code) {
				case 'Numpad5': // Perspective / Orthographic camera toggle
					sceneStore.switchCamera()
					break

				case 'Numpad1': // Front view
					setView(0, 0, 1, e.ctrlKey)
					break
				case 'Numpad3': // Right view
					setView(1, 0, 0, e.ctrlKey)
					break
				case 'Numpad7': // Top view
					setView(0, 1, 0, e.ctrlKey)
					break
				case 'Numpad9': // Bottom view
					setView(0, 1, 0, !e.ctrlKey)
					break

				case 'KeyG':
					sceneStore.setTransformMode('translate')
					break
				case 'KeyR':
					sceneStore.setTransformMode('rotate')
					break
				case 'KeyS':
					sceneStore.setTransformMode('scale')
					break

				case 'Delete':
					if (sceneStore.selectedObject) {
						sceneStore.deleteFromScene(sceneStore.selectedObject)
					}
					break
			}
		})

		useEventListener(window, 'keyup', (e) => {
			isCtrlDown.value = e.ctrlKey
			isShiftDown.value = e.shiftKey
		})

		// Moves perspective camera on scroll instead of zoom
		useEventListener(canvas, 'wheel', (event) => {
			const { activeCamera, controls } = sceneStore
			if (!controls) return
			const delta = event.deltaY * -0.01
			if (activeCamera instanceof THREE.PerspectiveCamera) {
				const direction = new THREE.Vector3()
				direction.subVectors(controls.target, activeCamera.position).normalize()
				activeCamera.position.addScaledVector(direction, delta)
			} else if (activeCamera instanceof THREE.OrthographicCamera) {
				const zoomFactor = 1 + delta * 0.1
				activeCamera.zoom *= zoomFactor
				activeCamera.updateProjectionMatrix()
			}
			controls.update()
		})

		function setView(x: number, y: number, z: number, invert: boolean) {
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
	}

	const showStatusBar = ref(true)

	return { pointerOnCanvas, isCtrlDown, isShiftDown, useHotKeys, showStatusBar }
})
