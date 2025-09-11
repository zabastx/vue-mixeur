<template>
	<div class="flex flex-col gap-2 items-end mr-[20%]">
		<NumberFieldRoot
			v-for="item in items"
			:key="'input_' + item.field"
			v-model="modelValue[item.field]"
			:step="0.01"
			as="label"
			class="block text-sm"
		>
			<span class="mr-2">{{ item.label }}</span>
			<div class="inline-block bg-(--color-ui-number-field-inner) rounded-sm">
				<NumberFieldDecrement>
					<IconChevronRight class="rotate-180" />
				</NumberFieldDecrement>
				<NumberFieldInput class="outline-none text-center w-40" />
				<NumberFieldIncrement>
					<IconChevronRight />
				</NumberFieldIncrement>
			</div>
		</NumberFieldRoot>
	</div>
</template>

<script lang="ts" setup>
import type { Vector3 } from 'three'

defineModel<Vector3>({ required: true })

const items = [
	{
		label: 'Location X',
		field: 'x'
	},
	{
		label: 'Y',
		field: 'y'
	},
	{
		label: 'Z',
		field: 'z'
	}
] as const
</script>
