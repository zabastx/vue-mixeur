<template>
	<Select.Root v-model="model">
		<Select.Trigger
			v-bind="trigger"
			class="inline-flex w-full max-w-full items-center justify-between gap-1 rounded border
				border-(--color-ui-menu-outline) bg-(--color-ui-menu-inner) px-1 py-0.5 text-[1em]
				text-(--color-ui-menu-text)"
		>
			<Select.Value :placeholder />
			<IconChevronRight class="rotate-90" />
		</Select.Trigger>

		<Select.Portal>
			<Select.Content
				v-bind="content"
				class="z-auto rounded border border-(--color-ui-menu-bg-outline)
					bg-(--color-ui-menu-bg-inner) p-0.5 text-[1em] text-(--color-ui-menu-text) select-none"
			>
				<ScrollContainer>
					<Select.Viewport class="flex flex-col gap-1">
						<Select.Item
							v-for="val in items"
							v-bind="item"
							:key="'item_' + val.value"
							:value="val"
							class="rounded p-1 leading-[1em] text-xs
								data-[highlighted]:text-(--color-ui-menu-item-selected)
								data-[highlighted]:bg-gray-500
								data-[state='checked']:bg-(--color-ui-menu-item-inner-selected)"
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

interface SelectProps extends SelectRootProps {
	placeholder?: string
	trigger?: SelectTriggerProps
	content?: SelectContentProps
	item?: SelectItemProps
	items: {
		value: AcceptableValue
		label: string
	}[]
}
</script>
