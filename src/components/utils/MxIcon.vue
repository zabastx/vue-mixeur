<!-- eslint-disable vue/no-v-html -->
<template>
	<span
		aria-hidden="true"
		class="flex leading-none justify-center items-center"
		v-html="svgContent"
	/>
</template>

<script lang="ts" setup>
import { computed } from 'vue'

const { name } = defineProps<{
	name: MxIconName
}>()

const icons = import.meta.glob('@/assets/icons/**/*.svg', {
	eager: true,
	query: '?raw',
	import: 'default'
}) as Record<string, string>

const svgContent = computed<string>(() => {
	const [folder, filename] = name.split('/')
	return icons[`/src/assets/icons/${folder}/${filename}.svg`]
})
</script>
