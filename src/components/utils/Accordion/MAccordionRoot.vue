<template>
	<Accordion.Root v-bind="$props">
		<slot></slot>
	</Accordion.Root>
</template>

<script lang="ts" setup>
import type { AccordionRootProps } from 'reka-ui'
import { Accordion } from 'reka-ui/namespaced'

defineProps<AccordionRootProps>()
</script>
