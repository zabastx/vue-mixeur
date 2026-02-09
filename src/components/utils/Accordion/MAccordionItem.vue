<template>
	<Accordion.Item
		v-slot="{ open }"
		class="text-xs rounded-ui-panel"
		v-bind="item"
		:class="{ 'border-ui-panel-outline border': !nested }"
	>
		<Accordion.Header class="bg-ui-panel-header px-2 py-1 text-ui-panel-title" v-bind="header">
			<Accordion.Trigger
				class="group flex w-full cursor-pointer items-center gap-1"
				v-bind="trigger"
			>
				<IconArrowRight
					class="transition-rotate inline-block size-[1em] duration-200
						group-data-[state='open']:rotate-90"
				/>
				<span class="font-panel-title">{{ label }}</span>
			</Accordion.Trigger>
		</Accordion.Header>
		<Accordion.Content
			class="data-[state='open']:animate-accordion-slide-down
				data-[state='closed']:animate-accordion-slide-up overflow-hidden text-ui-panel-text
				bg-ui-panel-header"
			v-bind="content"
			:class="{ 'bg-ui-sub-panel': nested }"
		>
			<slot :open="open"></slot>
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
