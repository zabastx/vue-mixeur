<template>
	<div
		class="grid grid-cols-[min-content_1fr] items-start gap-2.5 whitespace-nowrap relative"
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

const { inputWidth = '1fr', labelWidth = 'min-content' } = defineProps<{
	label: string
	inputWidth?: string
	labelWidth?: string
	reverse?: boolean
}>()

const gridCols = computed(() => `${labelWidth} ${inputWidth}`)
</script>
