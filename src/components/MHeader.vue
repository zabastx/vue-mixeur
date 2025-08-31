<template>
	<header class="bg-[#181818B3] p-1">
		<button type="button" class="cursor-pointer" @click="getFile">Import</button>
	</header>
</template>

<script lang="ts" setup>
import { useSceneStore } from '@/store/scene'

const sceneStore = useSceneStore()

function getFile() {
	const input = document.createElement('input')
	input.type = 'file'
	input.accept = '.glb'
	input.name = 'import'
	input.addEventListener('change', (e: Event) => {
		const $input = e.target as HTMLInputElement
		const file = $input.files?.[0]
		if (!file) return
		const fileUrl = URL.createObjectURL(file)
		sceneStore.importScene(fileUrl)
	})
	input.showPicker()
	input.remove()
}
</script>
