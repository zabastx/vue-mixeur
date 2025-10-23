<template>
	<label v-if="threeStore.selectedObject" class="mb-2.5 block text-sm">
		Name:
		<input
			v-model="threeStore.selectedObject.name"
			type="text"
			class="rounded bg-(--color-ui-text-inner) p-0.5 outline-none"
		/>
	</label>
	<MAccordionRoot collapsible type="multiple">
		<MAccordionItem
			v-if="threeStore.selectedObject"
			label="Transform"
			:item="{ value: 'transform' }"
		>
			<TransformLocation />
			<TransformRotation class="mt-1" />
			<TransformScale class="mt-1" />
		</MAccordionItem>
	</MAccordionRoot>
</template>

<script lang="ts" setup>
import { useThreeStore } from '@/store/three'

const threeStore = useThreeStore()
</script>
