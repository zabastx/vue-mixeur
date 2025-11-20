<template>
	<Accordion.Root
		v-bind="$props"
		class="border border-ui-box-outline rounded-ui-panel bg-ui-panel-background"
	>
		<slot></slot>
	</Accordion.Root>
</template>

<script lang="ts" setup>
import type { AccordionRootProps } from 'reka-ui'
import { Accordion } from 'reka-ui/namespaced'

defineProps<AccordionRootProps>()
</script>
