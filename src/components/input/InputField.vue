<template>
	<Label
		class="grid grid-cols-[min-content_1fr] items-center gap-2.5 whitespace-nowrap"
		:style="{ gridTemplateColumns: gridCols }"
	>
		{{ label }}
		<slot></slot>
	</Label>
</template>

<script lang="ts" setup>
import { computed } from 'vue'

const { inputWidth = 'fit-content' } = defineProps<{
	label: string
	inputWidth?: string
}>()

const gridCols = computed(() => `1fr ${inputWidth}`)
</script>
