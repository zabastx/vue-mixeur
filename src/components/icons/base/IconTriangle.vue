<template>
	<svg
		height="1em"
		viewBox="0 0 800 1000"
		width="0.8em"
		version="1.1"
		xmlns="http://www.w3.org/2000/svg"
		:class="classes"
	>
		<defs />
		<g>
			<path
				d="m94.50586 623c-.27842 0-.50585.2216-.50586.5v7c-.00061.4051.45544.6427.78711.4102l5-3.5c.28542-.199.28542-.6214 0-.8204l-5-3.5c-.0826-.058-.1806-.089-.28125-.09z"
				fill="#fff"
				fill-rule="evenodd"
				transform="matrix(100 0 0 100 -9300 -62200)"
			/>
		</g>
	</svg>
</template>

<script lang="ts" setup>
import { computed } from 'vue'

const { direction = 'right' } = defineProps<{
	direction?: 'up' | 'down' | 'left' | 'right'
}>()

const classes = computed(() => {
	if (direction === 'down') {
		return 'rotate-90'
	} else if (direction === 'left') {
		return 'rotate-180'
	} else if (direction === 'up') {
		return 'rotate-270'
	} else {
		return 'rotate-0'
	}
})
</script>

<style scoped></style>
