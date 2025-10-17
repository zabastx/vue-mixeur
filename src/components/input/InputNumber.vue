<template>
	<NumberFieldRoot v-model="modelValue" :step="step" class="flex w-fit justify-end">
		<span v-if="label" class="mr-2 overflow-hidden overflow-ellipsis whitespace-nowrap">
			{{ label }}
		</span>
		<div class="group flex w-fit overflow-hidden rounded-sm bg-(--color-ui-number-field-inner)">
			<NumberFieldDecrement
				class="cursor-pointer bg-(--color-ui-number-field-inner) px-0.5 opacity-0 group-hover:opacity-100"
			>
				<IconChevronRight class="rotate-180" />
			</NumberFieldDecrement>
			<NumberFieldInput
				class="w-full bg-(--color-ui-number-field-inner) text-center outline-none group-hover:brightness-110"
			/>
			<NumberFieldIncrement
				class="cursor-pointer bg-(--color-ui-number-field-inner) px-0.5 opacity-0 group-hover:opacity-100"
			>
				<IconChevronRight />
			</NumberFieldIncrement>
		</div>
	</NumberFieldRoot>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const { step = 0.01, label = undefined } = defineProps<{
	label?: string
	step?: number
}>()

const modelValue = ref(0)
</script>
