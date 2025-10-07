import THREE from '@/three'
import { type OrbitControls, SelectionBox, SelectionHelper } from 'three/examples/jsm/Addons.js'
import { ref, watch, type Ref } from 'vue'

export function setSelectionBox({ camera, renderer, scene, canvas, controls }: SelectionBoxParams) {
	const selectionBox = new SelectionBox(camera.value, scene)
	const helper = new SelectionHelper(renderer, 'selection-box')

	const selectedObjects = ref<THREE.Mesh[]>([])

	// Функция для перевода координат мыши в NDC относительно контейнера
	function getNormalizedPointer(event: PointerEvent, target: HTMLElement) {
		const rect = target.getBoundingClientRect()
		const { width, height, clientHeight, clientWidth } = target
		console.log('x y', event.clientX, event.clientY)
		return {
			x: (event.clientX - rect.left) / rect.width,
			y: -((event.clientY - rect.top) / rect.height)
		}
	}

	// Обработчики SelectionHelper
	helper.onSelectStart = (event: PointerEvent) => {
		if (event.button !== 0) return
		controls.enabled = false
		const { x, y } = getNormalizedPointer(event, canvas)
		selectionBox.startPoint.set(x, y, 0)
	}

	helper.onSelectMove = (event: PointerEvent) => {
		const { x, y } = getNormalizedPointer(event, canvas)
		selectionBox.endPoint.set(x, y, 0)
	}

	helper.onSelectOver = (event: PointerEvent) => {
		controls.enabled = true
		selectedObjects.value = selectionBox.select()
	}

	watch(camera, (newCam) => {
		selectionBox.camera = newCam
	})

	return selectedObjects
}

interface SelectionBoxParams {
	camera: Ref<THREE.Camera>
	scene: THREE.Scene
	renderer: THREE.WebGLRenderer
	canvas: HTMLCanvasElement
	controls: OrbitControls
}
