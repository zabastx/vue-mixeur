<template>
	<template v-if="threeStore.selectedObject">
		<InputField v-slot="{ id }" label="Name" class="mb-2.5 text-sm">
			<input
				:id
				v-model="threeStore.selectedObject.name"
				type="text"
				class="input text-xs"
				@change="sceneStore.updateScene"
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
import { useSceneStore } from '@/app/model/scene'
import { useThreeStore } from '@/app/model/three'

const threeStore = useThreeStore()
const sceneStore = useSceneStore()
</script>
