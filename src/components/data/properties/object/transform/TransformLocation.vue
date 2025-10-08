<template>
	<div v-if="store.selectedObject" class="flex flex-col gap-1 items-end mr-[20%]">
		<NumberFieldRoot
			v-for="item in items"
			:key="'input_' + item.field"
			v-model="store.selectedObject.position[item.field]"
			:step="0.01"
			as="label"
			class="block text-sm"
		>
			<span class="mr-2">{{ item.label }}</span>
			<div class="flex bg-(--color-ui-number-field-inner) rounded-sm overflow-hidden">
				<NumberFieldDecrement class="px-0.5 cursor-pointer bg-(--color-ui-number-field-inner)">
					<IconChevronRight class="rotate-180" />
				</NumberFieldDecrement>
				<NumberFieldInput class="outline-none text-center w-40" />
				<NumberFieldIncrement class="px-0.5 cursor-pointer bg-(--color-ui-number-field-inner)">
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
