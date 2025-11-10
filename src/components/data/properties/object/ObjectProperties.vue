<template>
	<template v-if="store.selectedObject">
		<InputField label="Name" class="mb-2.5 text-sm">
			<input
				v-model="store.selectedObject.name"
				type="text"
				class="input"
				@change="store.updateScene"
			/>
		</InputField>
		<MAccordionRoot collapsible type="multiple" class="flex gap-0.5 flex-col">
			<MAccordionItem label="Transform" :item="{ value: 'transform' }">
				<TransformLocation />
				<TransformRotation class="my-2" />
				<TransformScale />
			</MAccordionItem>
			<MAccordionItem label="Visibility" :item="{ value: 'visibility' }">
				<ObjectVisibility />
			</MAccordionItem>
		</MAccordionRoot>
	</template>
</template>

<script lang="ts" setup>
import { useThreeStore } from '@/store/three'

const store = useThreeStore()
</script>
