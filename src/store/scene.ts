import { defineStore } from 'pinia'
import * as THREE from 'three'
import { computed, shallowRef } from 'vue'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { createCamera } from './utils/camera'
import { loadGLTF } from './utils/loaders/GLTF'
import { setGridHelper } from './utils/helpers/grid'
import { setupBlenderControls } from './utils/controls/blenderControls'

export const useSceneStore = defineStore('scene', () => {
	const scene = shallowRef<THREE.Scene>()
	const renderer = shallowRef<THREE.WebGLRenderer>()
	const camera = shallowRef<THREE.PerspectiveCamera | THREE.OrthographicCamera>()
	const controls = shallowRef<OrbitControls>()

	const getScene = computed(() => scene)

	function initScene(canvas: HTMLCanvasElement) {
		scene.value = new THREE.Scene()
		renderer.value = new THREE.WebGLRenderer({
			canvas,
			antialias: true,
			alpha: true
		})
		setGridHelper(scene.value)

		const initialSceneObjects: THREE.Object3D[] = []

		camera.value = createCamera({
			type: 'Perspective',
			fov: 75,
			aspect: canvas.clientWidth / canvas.clientHeight,
			near: 0.1,
			far: 1000
		})
		camera.value.name = 'Default Perspective Camera'
		camera.value.position.set(2, 2, 2)
		camera.value.lookAt(0, 0, 0)

		const geometry = new THREE.BoxGeometry(1, 1, 1)
		const cube = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial({ color: 0x00ff00 }))
		initialSceneObjects.push(cube)

		const { orbitControls, gizmo } = setupBlenderControls(camera.value, renderer.value)
		controls.value = orbitControls

		renderer.value.render(scene.value, camera.value)
		const color = 0xffffff
		const intensity = 3
		const light = new THREE.PointLight(color, intensity)
		light.position.set(4, 1, 5)
		initialSceneObjects.push(light)

		initialSceneObjects.forEach((object) => {
			scene.value?.add(object)
		})
		renderer.value.setAnimationLoop(render)

		function render() {
			if (!scene.value || !camera.value) return

			if (resizeRendererToDisplaySize()) {
				if (camera.value instanceof THREE.PerspectiveCamera) {
					camera.value.aspect = canvas.clientWidth / canvas.clientHeight
				}
				camera.value.updateProjectionMatrix()
				gizmo.update()
			}

			renderer.value?.render(scene.value, camera.value)
			gizmo.render()
		}

		function resizeRendererToDisplaySize() {
			const { width, height, clientHeight, clientWidth } = canvas
			const needResize = width !== clientWidth || height !== clientHeight
			if (needResize) {
				renderer.value?.setSize(clientWidth, clientHeight, false)
			}
			return needResize
		}
	}

	async function importScene(url: string) {
		const importedScene = await loadGLTF({ url })
		if (importedScene) {
			const importedCamera = importedScene.cameras[0]
			scene.value?.add(importedScene.scene)
			if (
				importedCamera instanceof THREE.PerspectiveCamera ||
				importedCamera instanceof THREE.OrthographicCamera
			) {
				camera.value = importedCamera
				controls.value?.update()
				camera.value.updateProjectionMatrix()
			}
		}
	}

	return { initScene, getScene, importScene, camera, controls }
})
