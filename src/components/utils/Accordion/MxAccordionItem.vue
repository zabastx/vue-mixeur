<template>
	<Accordion.Item
		v-slot="{ open }"
		class="text-xs rounded-ui-panel overflow-hidden"
		v-bind="item"
		:class="{ 'border-ui-panel-outline border': !nested }"
	>
		<Accordion.Header
			class="bg-ui-panel-header text-ui-panel-title hover:brightness-125"
			v-bind="header"
		>
			<Accordion.Trigger
				class="group flex w-full cursor-pointer items-center gap-1 px-2 py-1"
				:class="{ 'pl-4': nested }"
				v-bind="trigger"
			>
				<MxIcon
					name="ui/arrow-right"
					class="transition-rotate inline-block size-[1em] duration-200
						group-data-[state='open']:rotate-90"
				/>
				<InputCheckbox v-if="showCheckbox" v-model="model" @click.stop />
				<MxIcon v-if="icon" :name="icon" />
				<span class="font-panel-title">{{ label }}</span>
			</Accordion.Trigger>
		</Accordion.Header>
		<Accordion.Content
			class="data-[state='open']:animate-accordion-slide-down
				data-[state='closed']:animate-accordion-slide-up overflow-hidden text-ui-panel-text
				bg-ui-panel-header relative"
			v-bind="content"
			:class="{ 'bg-ui-sub-panel': nested }"
		>
			<div
				v-show="!model && showCheckbox"
				class="inset-0 absolute z-10 bg-ui-panel-background/75 pointer-events-none"
			></div>
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

const model = defineModel<boolean>()

defineProps<{
	item: AccordionItemProps
	header?: AccordionHeaderProps
	trigger?: AccordionTriggerProps
	content?: AccordionContentProps
	label: string
	nested?: boolean
	showCheckbox?: boolean
	icon?: MxIconName
}>()
</script>
