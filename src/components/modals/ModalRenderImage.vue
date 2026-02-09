<template>
	<MDialog v-model:open="isOpen" title="Render Image" class="w-5xl bg-window-bg block-border">
		<!-- Header -->
		<h1 class="p-1 text-xl flex items-center gap-1 bg-header-background text-ui-text-text">
			<IconRenderImage /> Render Image
		</h1>

		<!-- Horizontal Layout: Preview + Settings -->
		<div class="flex gap-4 p-3">
			<!-- Left Side: Render Preview -->
			<div class="flex-1 min-w-0">
				<div class="space-y-2">
					<div
						class="relative flex justify-center items-center border border-ui-box-outline rounded
							overflow-hidden h-[500px]"
					>
						<canvas ref="canvasRef" class="max-w-full max-h-full m-auto opacity-0 hidden" />
						<img ref="previewRef" class="max-w-full max-h-full m-auto block" />
						<div
							v-if="isRendering"
							class="absolute inset-0 z-10 flex items-center justify-center bg-black/50"
						>
							<div class="flex items-center gap-2 text-white">
								<div
									class="animate-spin h-4 w-4 border-2 border-white border-t-transparent
										rounded-full"
								/>
								<span>Rendering...</span>
							</div>
						</div>
						<div class="absolute top-2 left-2 text-xs bg-black/50 px-2 py-1 rounded text-white">
							Preview
						</div>
						<button
							class="btn absolute top-2 right-2 text-xs px-2 py-1 rounded text-white"
							:disabled="isRendering"
							@click="renderImage()"
						>
							Render Preview
						</button>
					</div>
				</div>

				<!-- Render Metadata -->
				<div class="flex gap-4 text-sm text-ui-menu-bg-text mt-1">
					<div><b>Resolution:</b> {{ renderedImageData.resolution }}</div>
					<div><b>Format:</b> {{ renderedImageData.format }}</div>
					<div><b>Render Time:</b> {{ renderedImageData.renderTime }}s</div>
				</div>
			</div>

			<!-- Right Side: Settings -->
			<div class="flex flex-col gap-3">
				<RenderSettings v-model="renderSettings" />

				<!-- Action Buttons -->
				<div class="flex gap-2 text-ui-text-text text-sm justify-end mt-auto">
					<button class="btn" :disabled="isRendering" @click="close('renderImage')">Close</button>
					<button class="btn" :disabled="!canSaveImage" @click="saveImage">Save Image</button>
				</div>
			</div>
		</div>
	</MDialog>
</template>

<script lang="ts" setup>
import { useThreeStore } from '@/store/three'
import { useShadingStore } from '@/store/shading'
import { useTemplateRef, ref, computed, reactive } from 'vue'
import THREE from '@/three'
import { createRenderComposer } from '@/three/modules/postprocess/composer'
import { useModals } from '@/composables/useModals'
import { downloadFile } from '@/utils/files'
import type { RenderSettings } from './RenderSettings.vue'

const isOpen = defineModel<boolean>({ default: false })

const { close } = useModals()

const threeStore = useThreeStore()
const shadingStore = useShadingStore()

const renderSettings = ref<RenderSettings>({
	width: 1920,
	height: 1080,
	selectedFormat: 'webp',
	quality: 95,
	background: true
})

const renderedImageData = reactive({
	resolution: '',
	format: '',
	renderTime: 0
})

const isRendering = ref(false)
const isRendered = ref(false)
const actualWidth = ref(1920)
const actualHeight = ref(1080)

const canvasRef = useTemplateRef('canvasRef')
const previewRef = useTemplateRef('previewRef')

const canSaveImage = computed(() => !isRendering.value)

/**
 * Creates a render scene from the source scene, excluding helper objects.
 */
function createRenderScene(sourceScene: THREE.Scene): THREE.Scene {
	const renderScene = new THREE.Scene()

	renderScene.background = sourceScene.background?.clone() ?? null
	renderScene.environment = sourceScene.environment ?? null
	renderScene.fog = sourceScene.fog?.clone() ?? null

	// Clone non-helper objects
	sourceScene.children.forEach((child) => {
		if (!child.userData.isHelper) {
			const cloned = child.clone(true)
			renderScene.add(cloned)
		}
	})

	return renderScene
}

/**
 * Creates a render camera from the source camera.
 */
function createRenderCamera(
	sourceCamera: THREE.Camera
): THREE.PerspectiveCamera | THREE.OrthographicCamera {
	if (sourceCamera instanceof THREE.PerspectiveCamera) {
		const camera = new THREE.PerspectiveCamera()
		camera.copy(sourceCamera, true)
		return camera
	} else if (sourceCamera instanceof THREE.OrthographicCamera) {
		const camera = new THREE.OrthographicCamera()
		camera.copy(sourceCamera, true)
		return camera
	}

	const fallbackCamera = new THREE.PerspectiveCamera()
	fallbackCamera.position.copy(sourceCamera.position)
	fallbackCamera.rotation.copy(sourceCamera.rotation)
	fallbackCamera.scale.copy(sourceCamera.scale)
	return fallbackCamera
}

/**
 * Renders the scene to the canvas.
 */
async function renderImage(skipPreview?: boolean) {
	const originalMode = shadingStore.shadingMode
	isRendering.value = true
	isRendered.value = false

	const displayCanvas = canvasRef.value
	if (!displayCanvas) {
		isRendering.value = false
		return
	}

	const { width, height } = renderSettings.value

	actualWidth.value = width
	actualHeight.value = height

	try {
		shadingStore.setMode('export')

		const renderScene = createRenderScene(threeStore.scene)
		if (!renderSettings.value.background) {
			renderScene.background = null
		}

		const camera = createRenderCamera(threeStore.activeCamera) as
			| THREE.PerspectiveCamera
			| THREE.OrthographicCamera

		if (camera instanceof THREE.PerspectiveCamera) {
			camera.aspect = width / height
			camera.updateProjectionMatrix()
		}

		displayCanvas.width = width
		displayCanvas.height = height

		// Create render composer and render directly to display canvas
		const { composer, renderer } = createRenderComposer({
			scene: renderScene,
			camera: camera,
			canvas: displayCanvas
		})

		renderer.setSize(width, height, false)
		composer.setSize(width, height)

		// Measure render time
		const startTime = performance.now()
		composer.render()
		const endTime = performance.now()

		if (!skipPreview) {
			renderedImageData.resolution = `${renderSettings.value.width}x${renderSettings.value.height}`
			renderedImageData.format = renderSettings.value.selectedFormat
			renderedImageData.renderTime = Number(((endTime - startTime) / 1000).toFixed(2))

			if (previewRef.value?.src) {
				URL.revokeObjectURL(previewRef.value.src)
			}

			displayCanvas.toBlob(
				(blob) => {
					if (!blob || !previewRef.value) return
					previewRef.value.src = URL.createObjectURL(blob)
				},
				`image/${renderSettings.value.selectedFormat}`,
				renderSettings.value.quality / 100
			)
		}

		isRendered.value = true
	} catch (error) {
		console.error('Render failed:', error)
		isRendered.value = false
	} finally {
		shadingStore.setMode(originalMode)
		isRendering.value = false
	}
}

/**
 * Saves the rendered image to a file.
 */
async function saveImage() {
	const canvas = canvasRef.value
	if (!canvas) return
	await renderImage(true)

	try {
		const blob = await new Promise<Blob | null>((resolve) => {
			canvas.toBlob(
				(blob: Blob | null) => {
					resolve(blob)
				},
				`image/${renderSettings.value.selectedFormat}`,
				renderSettings.value.quality / 100
			)
		})

		if (!blob) return

		const resolution = `${renderSettings.value.width}x${renderSettings.value.height}`
		const filename = `render_${resolution}.${renderSettings.value.selectedFormat}`

		downloadFile(blob, filename, {
			mimeType: `image/${renderSettings.value.selectedFormat}`
		})
	} catch (error) {
		console.error('Save failed:', error)
	}
}
</script>
