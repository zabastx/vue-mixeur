<template>
	<div v-if="store.selectedObject" class="mr-[20%] flex flex-col items-end gap-1">
		<NumberFieldRoot
			v-for="item in items"
			:key="'input_' + item.field"
			v-model="store.selectedObject.scale[item.field]"
			:step="0.01"
			as="label"
			class="block text-sm"
		>
			<span class="mr-2">{{ item.label }}</span>
			<div class="inline-block rounded-sm bg-(--color-ui-number-field-inner)">
				<NumberFieldDecrement>
					<IconChevronRight class="rotate-180" />
				</NumberFieldDecrement>
				<NumberFieldInput class="w-40 text-center outline-none" />
				<NumberFieldIncrement>
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
		label: 'Scale X',
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
