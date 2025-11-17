<template>
	<NumberFieldRoot v-bind="props" v-model="model" class="flex justify-end">
		<div class="group flex grow max-w-full overflow-hidden rounded-sm bg-ui-number-inner">
			<NumberFieldDecrement
				class="cursor-pointer shrink-0 grow-0 bg-ui-number-inner px-0.5 opacity-0
					group-hover:opacity-100"
			>
				<IconArrowRight class="rotate-180 text-[0.75em]" />
			</NumberFieldDecrement>
			<NumberFieldInput
				class="grow w-full bg-ui-number-inner text-center outline-none group-hover:brightness-110"
			/>
			<NumberFieldIncrement
				class="shrink-0 grow-0 cursor-pointer bg-ui-number-inner px-0.5 opacity-0
					group-hover:opacity-100"
			>
				<IconArrowRight class="text-[0.75em]" />
			</NumberFieldIncrement>
		</div>
	</NumberFieldRoot>
</template>

<script lang="ts" setup>
import type { NumberFieldRootProps } from 'reka-ui'

const props = defineProps<NumberFieldRootProps>()

const model = defineModel<number>({ default: 0 })
</script>
