<template>
	<div
		class="grid grid-cols-[min-content_1fr] items-start gap-x-2.5 whitespace-nowrap relative"
		:style="{ gridTemplateColumns: gridCols }"
	>
		<MxTooltip :tooltip :tooltip-disabled="!tooltip">
			<span class="px-1 py-0.5 leading-4" :class="{ 'order-1': reverse }">
				{{ label }}
			</span>
		</MxTooltip>

		<slot></slot>
	</div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import type { MxTooltipContent } from '../utils/MxTooltip.vue'

const {
	inputWidth = 'auto',
	labelWidth = 'min-content',
	tooltip = undefined
} = defineProps<{
	label: string
	inputWidth?: string
	labelWidth?: string
	reverse?: boolean
	tooltip?: MxTooltipContent
}>()

const gridCols = computed(() => `${labelWidth} ${inputWidth}`)
</script>
