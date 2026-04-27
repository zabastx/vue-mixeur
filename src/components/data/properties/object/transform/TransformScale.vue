<template>
	<div class="flex flex-col items-end gap-0.5">
		<InputField label="Scale X">
			<InputNumber v-model="scaleX" :step="0.01" />
		</InputField>
		<InputField label="Y">
			<InputNumber v-model="scaleY" :step="0.01" />
		</InputField>
		<InputField label="Z">
			<InputNumber v-model="scaleZ" :step="0.01" />
		</InputField>
	</div>
</template>

<script lang="ts" setup>
import { useThreeStore } from '@/store/three'
import { storeToRefs } from 'pinia'
import { computed, triggerRef } from 'vue'

const { selectedObject } = storeToRefs(useThreeStore())

const scaleX = computed({
	get() {
		return selectedObject.value?.scale.x
	},
	set(value: number) {
		if (!selectedObject.value) return
		selectedObject.value.scale.x = value
		triggerRef(selectedObject)
	}
})

const scaleY = computed({
	get() {
		return selectedObject.value?.scale.y
	},
	set(value: number) {
		if (!selectedObject.value) return
		selectedObject.value.scale.y = value
		triggerRef(selectedObject)
	}
})

const scaleZ = computed({
	get() {
		return selectedObject.value?.scale.z
	},
	set(value: number) {
		if (!selectedObject.value) return
		selectedObject.value.scale.z = value
		triggerRef(selectedObject)
	}
})
</script>
