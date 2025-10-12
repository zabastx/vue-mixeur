<template>
	<TooltipRoot>
		<TooltipTrigger as-child v-bind="options?.trigger">
			<slot name="default"></slot>
		</TooltipTrigger>
		<TooltipPortal>
			<TooltipContent
				align="start"
				v-bind="options?.content"
				class="bg-(--color-ui-tooltip-inner) text-(--color-ui-tooltip-text) p-2 rounded border-(--color-ui-tooltip-outline) border text-xs max-w-xs flex flex-col gap-1"
			>
				<slot name="content">
					<span v-if="tooltip?.title">{{ tooltip.title }}</span>
					<p v-if="tooltip?.text">{{ tooltip?.text }}</p>
					<span v-if="tooltip?.footer" class="opacity-50 text-[0.9em]">{{ tooltip?.footer }}</span>
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
	tooltip?: MTooltipContent
	options?: {
		trigger?: TooltipTriggerProps
		content?: TooltipContentProps
	}
}>()

export interface MTooltipContent {
	title?: string
	text?: string
	footer?: string
}
</script>
