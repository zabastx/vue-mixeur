<template>
	<Select.Root v-bind="root" v-model="model">
		<Select.Trigger
			v-bind="trigger"
			class="inline-flex max-w-full items-center justify-between gap-1 rounded border
				border-ui-menu-outline bg-ui-menu-inner px-1 py-0.5 text-[1em] text-ui-menu-text"
			:class="$attrs.class"
		>
			<Select.Value :placeholder class="h-[1.5em]" />
			<IconChevronRight class="rotate-90" />
		</Select.Trigger>

		<Select.Portal disabled>
			<Select.Content
				v-bind="content"
				class="z-50 rounded border border-ui-menu-bg-outline bg-ui-menu-bg-inner p-0.5 text-[1em]
					text-ui-menu-text select-none"
			>
				<ScrollContainer>
					<Select.Viewport class="flex flex-col gap-1">
						<Select.Item
							v-for="val in items"
							v-bind="item"
							:key="'item_' + val.value"
							:value="val.value"
							class="rounded p-1 leading-[1em] text-xs data-highlighted:text-ui-menu-item-selected
								data-highlighted:bg-gray-500 data-[state='checked']:bg--menu-item-inner-selected"
						>
							<Select.ItemText>{{ val.label }}</Select.ItemText>
						</Select.Item>
					</Select.Viewport>
				</ScrollContainer>
			</Select.Content>
		</Select.Portal>
	</Select.Root>
</template>

<script lang="ts" setup>
import type {
	AcceptableValue,
	SelectContentProps,
	SelectItemProps,
	SelectRootProps,
	SelectTriggerProps
} from 'reka-ui'
import { Select } from 'reka-ui/namespaced'

defineProps<SelectProps>()

const model = defineModel<AcceptableValue | AcceptableValue[]>()

interface SelectProps {
	root?: SelectRootProps
	placeholder?: string
	trigger?: SelectTriggerProps
	content?: SelectContentProps
	item?: SelectItemProps
	items: InputSelectOption[]
}

export interface InputSelectOption {
	value: AcceptableValue
	label: string
}
</script>
