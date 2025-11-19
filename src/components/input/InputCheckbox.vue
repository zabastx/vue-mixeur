<template>
	<CheckboxRoot
		v-bind="props"
		v-model="model"
		class="size-5 rounded border border-ui-option-outline bg-ui-option-inner"
	>
		<CheckboxIndicator
			class="h-full text-xs w-full rounded flex items-center justify-center
				bg-ui-option-inner-selected"
		>
			<IconCheckmark />
		</CheckboxIndicator>
	</CheckboxRoot>
</template>

<script lang="ts" setup>
import type { CheckboxRootProps } from 'reka-ui'

const props = defineProps<CheckboxRootProps>()

const model = defineModel<boolean>()
</script>
