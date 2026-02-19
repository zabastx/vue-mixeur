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
		<MxAccordionRoot collapsible type="multiple" class="flex gap-0.5 flex-col">
			<MxAccordionItem label="Transform" :item="{ value: 'transform' }">
				<div class="p-1">
					<TransformLocation />
					<TransformRotation class="my-2" />
					<TransformScale />
				</div>
			</MxAccordionItem>
			<MxAccordionItem label="Visibility" :item="{ value: 'visibility' }">
				<ObjectVisibility />
			</MxAccordionItem>
		</MxAccordionRoot>
	</template>
</template>

<script lang="ts" setup>
import { useThreeStore } from '@/store/three'

const store = useThreeStore()
</script>
