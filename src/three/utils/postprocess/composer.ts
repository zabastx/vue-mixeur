import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass.js'
import THREE from '@/three'
import { createBlenderRenderer } from '../renderer'
import { watch, type Ref } from 'vue'
import { GammaCorrectionShader, ShaderPass, TAARenderPass } from 'three/examples/jsm/Addons.js'

export function createComposer(
	canvas: HTMLCanvasElement,
	scene: THREE.Scene,
	camera: Ref<THREE.PerspectiveCamera | THREE.OrthographicCamera>
) {
	const renderer = createBlenderRenderer({ canvas })

	const { width, height } = getCanvasSize(canvas)
	const composer = new EffectComposer(renderer)
	composer.setPixelRatio(window.devicePixelRatio)

	const renderPass = new RenderPass(scene, camera.value)
	composer.addPass(renderPass)

	const taaPass = new TAARenderPass(scene, camera.value)
	taaPass.sampleLevel = 2
	composer.addPass(taaPass)

	const outlinePass = new OutlinePass(new THREE.Vector2(width, height), scene, camera.value)
	outlinePass.edgeStrength = 3
	outlinePass.edgeThickness = 1
	outlinePass.visibleEdgeColor.set('#ffaa00')
	outlinePass.hiddenEdgeColor.set('#000000')
	composer.addPass(outlinePass)

	const gammaCorrectionPass = new ShaderPass(GammaCorrectionShader)
	composer.addPass(gammaCorrectionPass)

	resizeRendererToDisplaySize()

	function resizeRendererToDisplaySize() {
		const { width, height, clientHeight, clientWidth } = canvas
		const needResize = width !== clientWidth || height !== clientHeight
		if (needResize) {
			renderer.setSize(clientWidth, clientHeight, false)
			composer.setSize(clientWidth, clientHeight)
			outlinePass.resolution.set(clientWidth, clientHeight)
		}
		return needResize
	}

	watch(camera, (newCamera) => {
		renderPass.camera = newCamera
		outlinePass.renderCamera = newCamera
		taaPass.camera = newCamera
	})

	return { renderer, composer, outlinePass, resizeRendererToDisplaySize }
}

function getCanvasSize(canvas: HTMLCanvasElement) {
	const { clientHeight, clientWidth } = canvas
	return {
		width: clientWidth,
		height: clientHeight
	}
}
