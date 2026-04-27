<template>
	<div v-if="store.selectedObject" class="flex flex-col items-end gap-0.5">
		<InputField label="Rotation X">
			<InputNumber v-model="rotationX" :format-options="formatOptions" />
		</InputField>
		<InputField label="Y">
			<InputNumber v-model="rotationY" :format-options="formatOptions" />
		</InputField>
		<InputField label="Z">
			<InputNumber v-model="rotationZ" :format-options="formatOptions" />
		</InputField>
	</div>
</template>

<script lang="ts" setup>
import { useThreeStore } from '@/store/three'
import THREE from '@/three'
import type { NumberFieldRootProps } from 'reka-ui'
import { storeToRefs } from 'pinia'
import { computed, triggerRef } from 'vue'

const store = useThreeStore()
const { selectedObject } = storeToRefs(store)

const rotationX = computed({
	get() {
		if (!selectedObject.value) return 0
		return THREE.MathUtils.radToDeg(selectedObject.value.rotation.x)
	},
	set(value: number) {
		if (!selectedObject.value) return
		selectedObject.value.rotation.x = THREE.MathUtils.degToRad(value)
		triggerRef(selectedObject)
	}
})

const rotationY = computed({
	get() {
		if (!selectedObject.value) return 0
		return THREE.MathUtils.radToDeg(selectedObject.value.rotation.y)
	},
	set(value: number) {
		if (!selectedObject.value) return
		selectedObject.value.rotation.y = THREE.MathUtils.degToRad(value)
		triggerRef(selectedObject)
	}
})

const rotationZ = computed({
	get() {
		if (!selectedObject.value) return 0
		return THREE.MathUtils.radToDeg(selectedObject.value.rotation.z)
	},
	set(value: number) {
		if (!selectedObject.value) return
		selectedObject.value.rotation.z = THREE.MathUtils.degToRad(value)
		triggerRef(selectedObject)
	}
})

const formatOptions: NumberFieldRootProps['formatOptions'] = {
	style: 'unit',
	unitDisplay: 'narrow',
	unit: 'degree'
}
</script>
