<template>
	<Popover.Root v-bind="root">
		<Popover.Trigger v-bind="trigger" as-child>
			<slot name="trigger"></slot>
		</Popover.Trigger>
		<Popover.Portal v-bind="portal">
			<Popover.Content
				v-bind="content"
				avoid-collisions
				position-strategy="absolute"
				class="bg-ui-menu-bg-inner rounded p-2 z-3000 text-ui-menu-bg-text text-sm"
				@open-auto-focus.prevent
			>
				<slot name="content"></slot>
				<Popover.Arrow v-if="showArrow" class="fill-ui-menu-bg-inner" v-bind="arrow" />
			</Popover.Content>
		</Popover.Portal>
	</Popover.Root>
</template>

<script lang="ts" setup>
import type {
	PopoverArrowProps,
	PopoverContentProps,
	PopoverPortalProps,
	PopoverRootProps,
	PopoverTriggerProps
} from 'reka-ui'
import { Popover } from 'reka-ui/namespaced'

defineProps<{
	root?: PopoverRootProps
	trigger?: PopoverTriggerProps
	portal?: PopoverPortalProps
	content?: PopoverContentProps
	arrow?: PopoverArrowProps
	showArrow?: boolean
}>()
</script>
