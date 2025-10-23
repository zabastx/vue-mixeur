<template>
	<NumberFieldRoot v-model="model" :step="step" class="flex w-fit justify-end">
		<span v-if="label" class="mr-2 overflow-hidden overflow-ellipsis whitespace-nowrap">
			{{ label }}
		</span>
		<div class="group flex w-fit overflow-hidden rounded-sm bg-(--color-ui-number-field-inner)">
			<NumberFieldDecrement
				class="cursor-pointer bg-(--color-ui-number-field-inner) px-0.5 opacity-0 group-hover:opacity-100"
			>
				<IconArrowRight class="rotate-180 text-[0.75em]" />
			</NumberFieldDecrement>
			<NumberFieldInput
				class="w-full bg-(--color-ui-number-field-inner) text-center outline-none group-hover:brightness-110"
			/>
			<NumberFieldIncrement
				class="cursor-pointer bg-(--color-ui-number-field-inner) px-0.5 opacity-0 group-hover:opacity-100"
			>
				<IconArrowRight class="text-[0.75em]" />
			</NumberFieldIncrement>
		</div>
	</NumberFieldRoot>
</template>

<script lang="ts" setup>
const { step = 0.01, label = undefined } = defineProps<{
	label?: string
	step?: number
}>()

const model = defineModel<number>({ default: 0 })
</script>
