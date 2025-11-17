<template>
	<Accordion.Item v-slot="{ open }" class="overflow-hidden rounded-panel text-xs" v-bind="item">
		<Accordion.Header class="bg-properties-panel-header px-2 py-1" v-bind="header">
			<Accordion.Trigger
				class="group flex w-full cursor-pointer items-center gap-1"
				v-bind="trigger"
			>
				<IconArrowRight
					class="transition-rotate inline-block size-[1em] duration-200
						group-data-[state='open']:rotate-90"
				/>
				<span class="text-panel-title font-panel-title">{{ label }}</span>
			</Accordion.Trigger>
		</Accordion.Header>
		<Accordion.Content
			class="animation-slide overflow-hidden bg-properties-panel-background"
			v-bind="content"
		>
			<div class="pb-2.5 pt-1 pr-3" :class="{ 'pr-0!': nested }">
				<slot :open="open"></slot>
			</div>
		</Accordion.Content>
	</Accordion.Item>
</template>

<script lang="ts" setup>
import type {
	AccordionContentProps,
	AccordionHeaderProps,
	AccordionItemProps,
	AccordionTriggerProps
} from 'reka-ui'
import { Accordion } from 'reka-ui/namespaced'

defineProps<{
	item: AccordionItemProps
	header?: AccordionHeaderProps
	trigger?: AccordionTriggerProps
	content?: AccordionContentProps
	label: string
	nested?: boolean
}>()
</script>

<style scoped>
.animation-slide {
	animation-duration: 200ms;
	animation-timing-function: ease-out;

	&[data-state='open'] {
		animation-name: slide-down;
	}

	&[data-state='closed'] {
		animation-name: slide-up;
	}
}

@keyframes slide-down {
	from {
		height: 0;
	}
	to {
		height: var(--reka-accordion-content-height);
	}
}

@keyframes slide-up {
	from {
		height: var(--reka-accordion-content-height);
	}
	to {
		height: 0;
	}
}
</style>
