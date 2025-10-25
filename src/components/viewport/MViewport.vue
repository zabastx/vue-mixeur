<template>
	<div
		ref="wrapper"
		class="relative grid h-full w-full grid-rows-[1fr_min_content] overflow-hidden rounded"
	>
		<ViewportHeader class="absolute top-0 left-0 z-1 w-full bg-viewport-header-bg" />
		<div class="relative overflow-hidden">
			<div class="gizmo-wrapper absolute top-10 right-0"></div>
			<ViewNavigationWidget class="absolute top-40 right-2.5" />
			<div v-show="isError" ref="webglErrorRef" class="webgl-error"></div>
			<canvas v-show="!isError" ref="canvasRef" class="block h-full w-full"></canvas>
		</div>
		<ViewportToolbar />
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
	@apply flex h-full w-full items-center justify-center text-black;
	div {
		@apply bg-white p-2.5;
	}
	a {
		@apply text-blue-600! underline;
	}
}
</style>
