<template>
	<div
		ref="wrapper"
		class="canvas-wrapper relative rounded overflow-hidden bg-[#3D3D3D] h-full w-full"
	>
		<ViewNavigationWidget class="absolute top-32 right-2.5" />
		<div v-show="isError" ref="webglErrorRef" class="webgl-error"></div>
		<canvas v-show="!isError" ref="canvasRef" class="w-full h-full block"></canvas>
	</div>
</template>

<script lang="ts" setup>
import { useThreeStore } from '@/store/three'
import { onMounted, ref, useTemplateRef } from 'vue'
import WebGL from 'three/addons/capabilities/WebGL.js'
import ViewNavigationWidget from './ViewNavigationWidget.vue'
import { useAppStore } from '@/store/app'

const appStore = useAppStore()
const canvas = useTemplateRef('canvasRef')
appStore.useHotKeys(canvas)

const sceneStore = useThreeStore()
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
	sceneStore.initScene(canvas)
})
</script>

<style>
@reference 'tailwindcss/theme';

.webgl-error {
	@apply w-full h-full flex items-center justify-center text-black;
	div {
		@apply bg-white p-2.5;
	}
	a {
		@apply text-blue-600! underline;
	}
}
</style>
