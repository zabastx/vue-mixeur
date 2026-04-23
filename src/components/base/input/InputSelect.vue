<template>
	<Select.Root v-bind="root" v-model="model">
		<Select.Trigger
			v-bind="trigger"
			class="inline-flex max-w-full items-center justify-between gap-1 rounded-ui-select border
				border-ui-select-outline bg-ui-select-bg px-1 py-0.5 text-ui-select-text"
			:class="$attrs.class"
		>
			<Select.Value :placeholder class="h-[1.5em] truncate" />
			<MxIcon name="ui/chevron-right" class="rotate-90" />
		</Select.Trigger>

		<Select.Portal disabled>
			<Select.Content
				v-bind="content"
				class="z-50 rounded-ui-select-menu border border-ui-select-menu-outline bg-ui-select-menu-bg
					p-0.5 text-ui-menu-text select-none"
			>
				<ScrollContainer>
					<Select.Viewport class="flex flex-col gap-1">
						<Select.Item
							v-for="val in items"
							v-bind="item"
							:key="'option_' + val.label"
							:value="val.value"
							class="rounded-ui-select p-1 text-xs data-highlighted:brightness-125
								data-highlighted:bg-ui-select-bg-selected
								data-[state='checked']:bg-ui-select-bg-selected
								data-[state='checked']:text-ui-select-text-selected cursor-pointer"
						>
							<MxTooltip :tooltip-disabled="!val.tooltip" :tooltip="val.tooltip">
								<Select.ItemText>{{ val.label }}</Select.ItemText>
							</MxTooltip>
						</Select.Item>
					</Select.Viewport>
				</ScrollContainer>
			</Select.Content>
		</Select.Portal>
	</Select.Root>
</template>

<script lang="ts" setup generic="T extends string | number | Record<string, unknown> | null">
import type {
	SelectContentProps,
	SelectItemProps,
	SelectRootProps,
	SelectTriggerProps
} from 'reka-ui'
import { Select } from 'reka-ui/namespaced'
import type { MxTooltipContent } from '../ui/MxTooltip.vue'

defineProps<SelectProps>()

const model = defineModel<T>()

interface SelectProps {
	root?: SelectRootProps
	placeholder?: string
	trigger?: SelectTriggerProps
	content?: SelectContentProps
	item?: SelectItemProps
	items: InputSelectOption[] | readonly InputSelectOption[]
}

interface InputSelectOption {
	value: T
	label: string
	tooltip?: MxTooltipContent
}
</script>
