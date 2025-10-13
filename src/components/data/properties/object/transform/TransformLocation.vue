<template>
	<div v-if="store.selectedObject" class="mr-[20%] flex flex-col items-end gap-1">
		<NumberFieldRoot
			v-for="item in items"
			:key="'input_' + item.field"
			v-model="store.selectedObject.position[item.field]"
			:step="0.01"
			as="label"
			class="block text-sm"
		>
			<span class="mr-2">{{ item.label }}</span>
			<div class="flex overflow-hidden rounded-sm bg-(--color-ui-number-field-inner)">
				<NumberFieldDecrement class="cursor-pointer bg-(--color-ui-number-field-inner) px-0.5">
					<IconChevronRight class="rotate-180" />
				</NumberFieldDecrement>
				<NumberFieldInput class="w-40 text-center outline-none" />
				<NumberFieldIncrement class="cursor-pointer bg-(--color-ui-number-field-inner) px-0.5">
					<IconChevronRight />
				</NumberFieldIncrement>
			</div>
		</NumberFieldRoot>
	</div>
</template>

<script lang="ts" setup>
import { useThreeStore } from '@/store/three'

const store = useThreeStore()

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
