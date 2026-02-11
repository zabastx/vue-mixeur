<template>
	<div
		class="grid grid-cols-[min-content_1fr] items-start gap-2.5 whitespace-nowrap relative"
		:style="{ gridTemplateColumns: gridCols }"
	>
		<MTooltip :tooltip :tooltip-disabled="!tooltip">
			<span class="px-1 py-0.5" :class="{ 'order-1': reverse }">
				{{ label }}
			</span>
		</MTooltip>

		<slot></slot>
	</div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import type { MTooltipContent } from '../utils/MTooltip.vue'

const {
	inputWidth = 'auto',
	labelWidth = 'min-content',
	tooltip = undefined
} = defineProps<{
	label: string
	inputWidth?: string
	labelWidth?: string
	reverse?: boolean
	tooltip?: MTooltipContent
}>()

const gridCols = computed(() => `${labelWidth} ${inputWidth}`)
</script>
