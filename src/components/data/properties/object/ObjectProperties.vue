<template>
	<InputField v-if="store.selectedObject" label="Name" class="mb-2.5 text-sm">
		<input
			v-model="store.selectedObject.name"
			type="text"
			class="input"
			@change="store.updateScene"
		/>
	</InputField>
	<MAccordionRoot collapsible type="multiple">
		<MAccordionItem v-if="store.selectedObject" label="Transform" :item="{ value: 'transform' }">
			<TransformLocation />
			<TransformRotation class="my-2" />
			<TransformScale />
		</MAccordionItem>
	</MAccordionRoot>
</template>

<script lang="ts" setup>
import { useThreeStore } from '@/store/three'

const store = useThreeStore()
</script>
