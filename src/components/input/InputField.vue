<template>
	<Label class="inline-flex items-center gap-2.5 whitespace-nowrap">
		{{ label }}
		<slot></slot>
	</Label>
</template>

<script lang="ts" setup>
defineProps<{
	label: string
}>()
</script>
