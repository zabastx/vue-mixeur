import THREE from '@/three'
import { initPMREMGenerator } from '@/three/modules/extras/pmremGenerator'
import { acceptHMRUpdate, defineStore } from 'pinia'
import type { ViewportGizmo } from 'three-viewport-gizmo'
import {
	EffectComposer,
	GammaCorrectionShader,
	OutlinePass,
	RenderPass,
	ShaderPass,
	TAARenderPass
} from 'three/examples/jsm/Addons.js'
import { shallowRef, watch, type Ref, type ShallowRef } from 'vue'

interface ComposerParameters {
	canvas: HTMLCanvasElement
	scene: THREE.Scene
	camera: Ref<THREE.PerspectiveCamera | THREE.OrthographicCamera>
	gizmo: ShallowRef<ViewportGizmo | undefined>
}

type ComposerPass = ShaderPass | TAARenderPass | RenderPass

export const useComposerStore = defineStore('composer', () => {
	const rendererRef = shallowRef<THREE.WebGLRenderer>()
	const composerRef = shallowRef<EffectComposer>()

	const composerPasses = shallowRef<ComposerPass[]>([])

	function setupRenderer({ canvas }: { canvas: HTMLCanvasElement }) {
		const renderer = new THREE.WebGLRenderer({
			canvas,
			alpha: true,
			precision: 'highp',
			powerPreference: 'high-performance'
		})

		const { clientWidth, clientHeight } = canvas

		renderer.setPixelRatio(window.devicePixelRatio)
		renderer.setSize(clientWidth, clientHeight, false)

		renderer.toneMapping = THREE.ACESFilmicToneMapping
		renderer.outputColorSpace = THREE.SRGBColorSpace
		renderer.toneMappingExposure = 1.0
		renderer.shadowMap.enabled = true
		renderer.shadowMap.type = THREE.PCFSoftShadowMap
		renderer.autoClear = false

		return renderer
	}

	function setupComposer({
		camera,
		canvas,
		gizmo,
		scene,
		renderer
	}: ComposerParameters & { renderer: THREE.WebGLRenderer }) {
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

		composerPasses.value.push(renderPass, taaPass, gammaCorrectionPass)

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
				renderer.setPixelRatio(window.devicePixelRatio)

				if (camera.value instanceof THREE.PerspectiveCamera) {
					camera.value.aspect = clientWidth / clientHeight
				}

				camera.value.updateProjectionMatrix()
				gizmo.value?.update()
			}
		}

		return { composer, outlinePass, handleResize }
	}

	function setupRenderImageComposer() {
		if (!rendererRef.value) return console.warn('RendererRef is undefined')
		const composer = new EffectComposer(rendererRef.value)
		composerPasses.value.forEach((pass) => {
			composer.addPass(pass)
		})

		return { composer }
	}

	function init({ camera, canvas, gizmo, scene }: ComposerParameters) {
		const renderer = setupRenderer({ canvas })

		initPMREMGenerator(renderer)

		const { composer, handleResize, outlinePass } = setupComposer({
			canvas,
			camera,
			gizmo,
			scene,
			renderer
		})

		rendererRef.value = renderer
		composerRef.value = composer

		return {
			composer,
			handleResize,
			outlinePass,
			renderer
		}
	}

	return {
		composerPasses,
		init,
		setupRenderImageComposer
	}
})

if (import.meta.hot) {
	import.meta.hot.accept(acceptHMRUpdate(useComposerStore, import.meta.hot))
}
