<template>
	<div v-if="selectedObject" class="flex justify-center p-1">
		<div class="flex flex-col gap-1">
			<InputField reverse label="Selectable">
				<InputCheckbox
					v-model="getUserData(selectedObject).isSelectable"
					@update:model-value="updateObject"
				/>
			</InputField>
			<InputField reverse label="Frustum Culled">
				<InputCheckbox v-model="selectedObject.frustumCulled" @update:model-value="updateObject" />
			</InputField>
			<template v-if="!('isLight' in selectedObject)">
				<InputField reverse label="Cast shadow">
					<InputCheckbox v-model="selectedObject.castShadow" @update:model-value="updateObject" />
				</InputField>
				<InputField reverse label="Receive shadow">
					<InputCheckbox
						v-model="selectedObject.receiveShadow"
						@update:model-value="updateObject"
					/>
				</InputField>
			</template>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { useThreeStore } from '@/store/three'
import { getUserData } from '@/three/utils'
import { storeToRefs } from 'pinia'
import { triggerRef } from 'vue'

const threeStore = useThreeStore()

const { selectedObject } = storeToRefs(threeStore)

function updateObject() {
	triggerRef(selectedObject)
}
</script>
