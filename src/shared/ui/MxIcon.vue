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

const icons = import.meta.glob('@/app/assets/icons/**/*.svg', {
	eager: true,
	query: '?raw',
	import: 'default'
}) as Record<string, string>

const svgContent = computed<string>(() => {
	const [folder, iconName] = name.split('/')
	return icons[`/src/app/assets/icons/${folder}/${iconName}.svg`]
})
</script>
