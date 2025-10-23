<template>
	<Accordion.Item v-slot="{ open }" class="overflow-hidden rounded" v-bind="item">
		<Accordion.Header class="bg-(--color-properties-panel-header) px-2 py-0.5" v-bind="header">
			<Accordion.Trigger
				class="group flex w-full cursor-pointer items-center gap-1"
				v-bind="trigger"
			>
				<IconArrowRight
					class="transition-rotate inline-block size-[1em] text-xs duration-200 group-data-[state='open']:rotate-90"
				/>
				<span>{{ label }}</span>
			</Accordion.Trigger>
		</Accordion.Header>
		<Accordion.Content
			class="animation-slide overflow-hidden bg-(--color-properties-panel-background) text-xs"
			v-bind="content"
		>
			<div class="p-1 pr-3 pb-2.5">
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
}>()
</script>

<style scoped>
.animation-slide[data-state='open'] {
	animation: slide-down 200ms ease-out;
}

.animation-slide[data-state='closed'] {
	animation: slide-up 200ms ease-out;
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
