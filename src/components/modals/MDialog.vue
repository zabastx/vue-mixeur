<template>
	<Dialog.Root v-model="open">
		<Dialog.Trigger v-bind="trigger">
			<slot name="trigger"></slot>
		</Dialog.Trigger>
		<Dialog.Portal v-bind="portal">
			<Dialog.Overlay class="fixed inset-0" v-bind="overlay" />
			<Dialog.Content
				:aria-describedby="undefined"
				class="fixed top-1/2 left-1/2 w-full -translate-x-1/2 -translate-y-1/2 overflow-hidden
					rounded p-0"
				v-bind="content"
				:class="$attrs.class"
			>
				<VisuallyHidden as-child>
					<Dialog.Title>{{ title }}</Dialog.Title>
				</VisuallyHidden>
				<VisuallyHidden as-child>
					<Dialog.Description />
				</VisuallyHidden>
				<slot></slot>
			</Dialog.Content>
		</Dialog.Portal>
	</Dialog.Root>
</template>

<script lang="ts" setup>
import type {
	DialogContentProps,
	DialogOverlayProps,
	DialogPortalProps,
	DialogRootProps,
	DialogTriggerProps
} from 'reka-ui'
import { Dialog } from 'reka-ui/namespaced'

const open = defineModel<boolean>({ default: false })

defineProps<{
	title?: string
	root?: DialogRootProps
	trigger?: DialogTriggerProps
	portal?: DialogPortalProps
	overlay?: DialogOverlayProps
	content?: DialogContentProps
}>()
</script>
