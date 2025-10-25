<template>
	<h1 class="mb-1">Object Properties</h1>
	<InputField v-if="store.selectedObject" label="Name" class="mb-2.5 text-sm">
		<input v-model="store.selectedObject.name" type="text" class="input" />
	</InputField>
	<MAccordionRoot collapsible type="multiple">
		<MAccordionItem v-if="store.selectedObject" label="Transform" :item="{ value: 'transform' }">
			<TransformLocation />
			<TransformRotation class="mt-1" />
			<TransformScale class="mt-1" />
		</MAccordionItem>
	</MAccordionRoot>
</template>

<script lang="ts" setup>
import { useThreeStore } from '@/store/three'

const store = useThreeStore()
</script>
