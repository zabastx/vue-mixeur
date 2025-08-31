import { useSceneStore } from '@/store/scene'
import { useEventListener } from '@vueuse/core'
import { ref, type ShallowRef } from 'vue'
import * as THREE from 'three'

export function useHotKeys(canvas: Readonly<ShallowRef<HTMLCanvasElement | null>>) {
	const pointerOnCanvas = ref(false)
	const isPerspective = ref(true)

	const { camera, controls } = useSceneStore()

	useEventListener(canvas, 'mouseenter', () => (pointerOnCanvas.value = true))
	useEventListener(canvas, 'mouseleave', () => (pointerOnCanvas.value = false))

	useEventListener(window, 'keydown', (e) => {
		if (!pointerOnCanvas.value) return

		switch (e.code) {
			case 'Numpad5': // Perspective / Orthographic camera toggle
				isPerspective.value = !isPerspective.value
				// if (camera instanceof THREE.PerspectiveCamera) {
				// 	const aspect = renderer.domElement.clientWidth / renderer.domElement.clientHeight
				// 	const frustumSize = 10
				// 	const ortho = new THREE.OrthographicCamera(
				// 		(frustumSize * aspect) / -2,
				// 		(frustumSize * aspect) / 2,
				// 		frustumSize / 2,
				// 		frustumSize / -2,
				// 		0.1,
				// 		2000
				// 	)
				// 	ortho.position.copy(camera.position)
				// 	ortho.quaternion.copy(camera.quaternion)
				// 	camera = ortho
				// 	controls.object = camera
				// } else if (camera instanceof THREE.OrthographicCamera) {
				// 	const persp = new THREE.PerspectiveCamera(
				// 		60,
				// 		renderer.domElement.clientWidth / renderer.domElement.clientHeight,
				// 		0.1,
				// 		2000
				// 	)
				// 	persp.position.copy(camera.position)
				// 	persp.quaternion.copy(camera.quaternion)
				// 	camera = persp
				// 	controls.object = camera
				// }
				break

			case 'Numpad1': // Front / Back view
				setView(0, 0, 1, e.ctrlKey)
				break
			case 'Numpad3': // Right / Left view
				setView(1, 0, 0, e.ctrlKey)
				break
			case 'Numpad7': // Top / Bottom view
				setView(0, 1, 0, e.ctrlKey)
				break
		}
	})

	function setView(x: number, y: number, z: number, invert: boolean) {
		console.log('set view')
		if (!controls || !camera) return
		const dir = invert ? -1 : 1
		const distance = camera.position.distanceTo(controls.target)
		const newPos = new THREE.Vector3(x * dir, y * dir, z * dir).multiplyScalar(distance)
		camera.position.copy(controls.target).add(newPos)
		camera.up.set(0, 1, 0)
		camera.lookAt(controls.target)
		controls.update()
	}

	return {
		pointerOnCanvas,
		isPerspective
	}
}
