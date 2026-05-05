<template>
	<EditorWrapper>
		<div ref="wrapper" class="grid h-full grid-rows-[1fr_min_content]">
			<ViewportHeader
				v-if="threeStore.isInitiated"
				class="absolute top-0 left-0 z-1 w-full bg-viewport-header-bg"
			/>
			<div class="relative overflow-hidden">
				<div class="gizmo-wrapper absolute top-10 right-0"></div>
				<ViewNavigationWidget v-if="threeStore.isInitiated" class="absolute top-40 right-2.5" />
				<div v-if="isError" ref="webglErrorRef" class="webgl-error"></div>
				<canvas
					v-else
					ref="canvasRef"
					class="block h-full w-full"
					data-testid="viewport-canvas"
				></canvas>
			</div>
			<Transition name="slide-fade-left">
				<ViewportToolbar
					v-if="threeStore.isInitiated && appStore.showToolbar"
					class="absolute top-20 left-2.5"
				/>
			</Transition>
		</div>
	</EditorWrapper>
</template>

<script lang="ts" setup>
import { useThreeStore } from '@/app/model/three'
import { onMounted, ref, useTemplateRef } from 'vue'
import WebGL from 'three/addons/capabilities/WebGL.js'
import ViewNavigationWidget from './ViewNavigationWidget.vue'
import { useAppStore } from '@/app/model/app'
import { useInputStore } from '@/app/model/input'
import { createLight } from '@/shared/three/modules/light'
import { createMesh } from '@/shared/three/modules/mesh'
import { createCamera } from '@/shared/three/modules/camera/create'
import { useCameraStore } from '@/app/model/camera'
import { useSceneStore } from '@/app/model/scene'

const appStore = useAppStore()
const inputStore = useInputStore()
const canvasRef = useTemplateRef('canvasRef')
inputStore.init(canvasRef)

const sceneStore = useSceneStore()
const threeStore = useThreeStore()
const webglErrorRef = useTemplateRef('webglErrorRef')
const isError = ref(false)

onMounted(() => {
	if (!WebGL.isWebGL2Available()) {
		isError.value = true
		const $error = WebGL.getWebGL2ErrorMessage()
		$error.setAttribute('style', '')
		webglErrorRef.value?.appendChild($error)
		return
	}

	threeStore.initScene(canvasRef)
	setInitialObjects()
})

function setInitialObjects() {
	const pointLight = createLight({ type: 'point' })
	pointLight.power = 1000
	pointLight.position.set(4, 5, 1)

	sceneStore.addObjectToScene(pointLight)

	const camera = createCamera({
		type: 'Perspective',
		name: 'Camera',
		near: 0.1,
		far: 1000,
		fov: 39.6
	})

	camera.position.set(-4, 4, 6)
	camera.lookAt(0, 0, 0)

	sceneStore.addObjectToScene(camera)

	const cameraStore = useCameraStore()
	cameraStore.setRenderCamera(camera.uuid)

	const companionCube = createMesh('cube')

	sceneStore.addObjectToScene(companionCube)
}
</script>

<style>
@reference 'tailwindcss/theme';

.webgl-error {
	@apply flex h-full w-full items-center justify-center text-black;
	div {
		@apply bg-white p-2.5;
	}
	a {
		@apply text-blue-600! underline;
	}
}
</style>
