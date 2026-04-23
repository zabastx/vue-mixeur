<template>
	<Dialog.Root v-bind="root" v-model:open="open">
		<Dialog.Trigger v-bind="trigger">
			<slot name="trigger"></slot>
		</Dialog.Trigger>
		<Dialog.Portal v-bind="portal">
			<Dialog.Overlay class="fixed inset-0" v-bind="overlay" />
			<Dialog.Content
				v-bind="content"
				as-child
				@interact-outside="(e) => (outsideInteraction ? e.preventDefault() : undefined)"
			>
				<div
					ref="dialogContentRef"
					:style="style"
					class="fixed overflow-hidden p-0 z-1000 focus-within:z-2000"
					:class="[$attrs.class, { resize, rounded: !title }]"
				>
					<Dialog.Title
						v-if="title"
						class="grid grid-cols-[1fr_min-content] bg-black text-ui-text-text"
					>
						<div ref="handleRef" class="flex items-center gap-1 cursor-move py-1 px-2">
							<MxIcon v-if="icon" :name="icon" />
							<h1>
								{{ title }}
							</h1>
						</div>
						<div class="ml-auto cursor-default flex" @pointerdown.stop>
							<button
								type="button"
								class="block h-full w-10 hover:bg-[#e81123]"
								aria-label="Close dialog"
								@click="open = false"
							>
								<MxIcon name="ui/close" class="m-auto" />
							</button>
						</div>
					</Dialog.Title>
					<div
						v-else
						ref="handleRef"
						class="z-10 absolute top-0 left-0 w-full h-5 cursor-move"
					></div>
					<VisuallyHidden as-child>
						<Dialog.Description />
					</VisuallyHidden>
					<slot></slot>
				</div>
			</Dialog.Content>
		</Dialog.Portal>
	</Dialog.Root>
</template>

<script lang="ts" setup>
import { useDraggable } from '@vueuse/core'
import type {
	DialogContentProps,
	DialogOverlayProps,
	DialogPortalProps,
	DialogRootProps,
	DialogTriggerProps
} from 'reka-ui'
import { Dialog } from 'reka-ui/namespaced'
import { useTemplateRef, watch } from 'vue'

const open = defineModel<boolean>({ default: false })

defineProps<{
	title?: string
	root?: DialogRootProps
	trigger?: DialogTriggerProps
	portal?: DialogPortalProps
	overlay?: DialogOverlayProps
	content?: DialogContentProps
	resize?: boolean
	outsideInteraction?: boolean
	icon?: MxIconName
}>()

const dialogContentRef = useTemplateRef('dialogContentRef')
const handleRef = useTemplateRef('handleRef')

const { style, x, y } = useDraggable(dialogContentRef, {
	handle: handleRef,
	containerElement: document.body
})

watch(dialogContentRef, (ref) => {
	if (!ref) return
	const { innerWidth, innerHeight } = window
	const contentWidth = dialogContentRef.value?.clientWidth || 0
	const contentHeight = dialogContentRef.value?.clientHeight || 0
	x.value = innerWidth / 2 - contentWidth / 2
	y.value = innerHeight / 2 - contentHeight / 2
})
</script>
