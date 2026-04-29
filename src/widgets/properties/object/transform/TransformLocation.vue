<template>
	<div v-if="store.selectedObject" class="flex flex-col items-end gap-0.5">
		<InputField label="Location X">
			<InputNumber v-model="positionX" :step="0.01" />
		</InputField>
		<InputField label="Y">
			<InputNumber v-model="positionY" :step="0.01" />
		</InputField>
		<InputField label="Z">
			<InputNumber v-model="positionZ" :step="0.01" />
		</InputField>
	</div>
</template>

<script lang="ts" setup>
import { useThreeStore } from '@/app/model/three'
import { storeToRefs } from 'pinia'
import { computed, triggerRef } from 'vue'

const store = useThreeStore()

const { selectedObject } = storeToRefs(store)

const positionX = computed({
	set(val: number) {
		if (!selectedObject.value) return
		selectedObject.value.position.x = val
		triggerRef(selectedObject)
	},
	get() {
		return selectedObject.value?.position.x
	}
})

const positionY = computed({
	set(val: number) {
		if (!selectedObject.value) return
		selectedObject.value.position.y = val
		triggerRef(selectedObject)
	},
	get() {
		return selectedObject.value?.position.y
	}
})

const positionZ = computed({
	set(val: number) {
		if (!selectedObject.value) return
		selectedObject.value.position.z = val
		triggerRef(selectedObject)
	},
	get() {
		return selectedObject.value?.position.z
	}
})
</script>
