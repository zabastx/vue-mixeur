<template>
	<div
		class="grid grid-cols-[min-content_1fr] grid- items-start gap-2.5 whitespace-nowrap"
		:style="{ gridTemplateColumns: gridCols }"
	>
		<span class="px-1 py-0.5" :class="{ 'order-1': reverse }">
			{{ label }}
		</span>
		<slot></slot>
	</div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'

const { inputWidth = 'fit-content' } = defineProps<{
	label: string
	inputWidth?: string
	reverse?: boolean
}>()

const gridCols = computed(() => `1fr ${inputWidth}`)
</script>
