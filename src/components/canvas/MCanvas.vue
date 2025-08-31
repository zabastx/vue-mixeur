<template>
	<div
		ref="wrapper"
		class="canvas-wrapper relative rounded overflow-hidden bg-[#3D3D3D] h-full w-full"
	>
		<button
			type="button"
			class="absolute top-32 right-2.5 text-white text-xl bg-black opacity-50 cursor-pointer p-1.5 rounded-full hover:bg-gray-500"
			@click="isPerspective = !isPerspective"
		>
			<IconGridPerspective v-if="isPerspective" />
			<IconGridOrthographic v-else />
		</button>
		<canvas ref="canvasRef" class="w-full h-full block"></canvas>
	</div>
</template>

<script lang="ts" setup>
import { useSceneStore } from '@/store/scene'
import { onMounted, useTemplateRef } from 'vue'
import IconGridPerspective from '../icons/IconGridPerspective.vue'
import IconGridOrthographic from '../icons/IconGridOrthographic.vue'
import { useHotKeys } from '@/composables/hotkeys'

const sceneStore = useSceneStore()
const canvas = useTemplateRef('canvasRef')

const { isPerspective } = useHotKeys(canvas)

onMounted(() => {
	if (!canvas.value) return
	sceneStore.initScene(canvas.value)
})
</script>

<style scoped></style>
