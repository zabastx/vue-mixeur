import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass.js'
import THREE from '@/three'
import { createBlenderRenderer } from '../renderer'
import { watch, type Ref, type ShallowRef } from 'vue'
import { GammaCorrectionShader, ShaderPass, TAARenderPass } from 'three/examples/jsm/Addons.js'
import type { ViewportGizmo } from 'three-viewport-gizmo'

export function createComposer({ camera, canvas, gizmo, scene }: ComposerParameters) {
	const renderer = createBlenderRenderer({ canvas })
	const composer = new EffectComposer(renderer)
	composer.setPixelRatio(window.devicePixelRatio)

	const renderPass = new RenderPass(scene, camera.value)
	composer.addPass(renderPass)

	const taaPass = new TAARenderPass(scene, camera.value)
	taaPass.sampleLevel = 2
	composer.addPass(taaPass)

	const outlinePass = new OutlinePass(
		new THREE.Vector2(canvas.clientWidth, canvas.clientHeight),
		scene,
		camera.value
	)
	outlinePass.edgeStrength = 5
	outlinePass.edgeThickness = 1
	outlinePass.edgeGlow = 0
	outlinePass.visibleEdgeColor.set('#ffaa00')
	outlinePass.hiddenEdgeColor.set('#ffaa00')
	composer.addPass(outlinePass)

	const gammaCorrectionPass = new ShaderPass(GammaCorrectionShader)
	composer.addPass(gammaCorrectionPass)

	watch(camera, (newCamera) => {
		renderPass.camera = newCamera
		outlinePass.renderCamera = newCamera
		taaPass.camera = newCamera
	})

	function handleResize() {
		const { width, height } = renderer.getSize(new THREE.Vector2())
		const { clientWidth, clientHeight } = canvas

		if (width !== clientWidth || height !== clientHeight) {
			renderer.setSize(clientWidth, clientHeight, false)
			composer.setSize(clientWidth, clientHeight)

			if (camera.value instanceof THREE.PerspectiveCamera) {
				camera.value.aspect = clientWidth / clientHeight
			}

			camera.value.updateProjectionMatrix()
			gizmo.value?.update()
		}
	}

	return { renderer, composer, outlinePass, handleResize }
}

interface ComposerParameters {
	canvas: HTMLCanvasElement
	scene: THREE.Scene
	camera: Ref<THREE.PerspectiveCamera | THREE.OrthographicCamera>
	gizmo: ShallowRef<ViewportGizmo | undefined>
}
