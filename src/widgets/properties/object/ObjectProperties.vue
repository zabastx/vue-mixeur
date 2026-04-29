<template>
	<template v-if="store.selectedObject">
		<InputField v-slot="{ id }" label="Name" class="mb-2.5 text-sm">
			<input
				:id
				v-model="store.selectedObject.name"
				type="text"
				class="input text-xs"
				@change="store.updateScene"
			/>
		</InputField>
		<MxAccordionRoot collapsible type="multiple" class="flex gap-0.5 flex-col">
			<MxAccordionItem label="Transform" :item="{ value: 'transform' }">
				<div class="p-1 space-y-2">
					<TransformLocation />
					<TransformRotation />
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
import { useThreeStore } from '@/app/model/three'

const store = useThreeStore()
</script>
