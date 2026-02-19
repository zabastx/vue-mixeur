<template>
	<TooltipRoot :disabled="tooltipDisabled">
		<TooltipTrigger as-child v-bind="options?.trigger">
			<slot name="default"></slot>
		</TooltipTrigger>
		<TooltipPortal>
			<TooltipContent
				align="start"
				v-bind="options?.content"
				class="flex max-w-xs flex-col gap-1 rounded border border-ui-tooltip-outline
					bg-ui-tooltip-inner p-2 text-tooltip text-ui-tooltip-text"
			>
				<slot name="content">
					<span v-if="tooltip?.title">{{ tooltip.title }}</span>
					<p v-if="tooltip?.text">{{ tooltip?.text }}</p>
					<span v-if="tooltip?.footer" class="text-[0.9em] opacity-50">{{ tooltip?.footer }}</span>
				</slot>
			</TooltipContent>
		</TooltipPortal>
	</TooltipRoot>
</template>

<script lang="ts" setup>
import {
	TooltipContent,
	TooltipPortal,
	TooltipRoot,
	TooltipTrigger,
	type TooltipContentProps,
	type TooltipTriggerProps
} from 'reka-ui'

defineProps<{
	tooltipDisabled?: boolean
	tooltip?: MxTooltipContent
	options?: {
		trigger?: TooltipTriggerProps
		content?: TooltipContentProps
	}
}>()

export interface MxTooltipContent {
	title?: string
	text?: string
	footer?: string
}
</script>
