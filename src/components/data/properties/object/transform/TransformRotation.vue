<template>
	<div class="flex flex-col items-end gap-0.5">
		<InputField label="Rotation X">
			<InputNumber v-model="rotationX" label="Rotation X" :format-options="formatOptions" />
		</InputField>
		<InputField label="Y">
			<InputNumber v-model="rotationY" label="Y" :format-options="formatOptions" />
		</InputField>
		<InputField label="Z">
			<InputNumber v-model="rotationZ" label="Z" :format-options="formatOptions" />
		</InputField>
	</div>
</template>

<script lang="ts" setup>
import { useThreeStore } from '@/store/three'
import THREE from '@/three'
import type { NumberFieldRootProps } from 'reka-ui'
import { computed } from 'vue'

const store = useThreeStore()

const rotationX = computed({
	get() {
		return THREE.MathUtils.radToDeg(store.selectedObject!.rotation.x)
	},
	set(val) {
		if (!store.selectedObject) return
		store.selectedObject.rotation.x = THREE.MathUtils.degToRad(val)
	}
})

const rotationY = computed({
	get() {
		return THREE.MathUtils.radToDeg(store.selectedObject!.rotation.y)
	},
	set(val) {
		if (!store.selectedObject) return
		store.selectedObject.rotation.y = THREE.MathUtils.degToRad(val)
	}
})

const rotationZ = computed({
	get() {
		return THREE.MathUtils.radToDeg(store.selectedObject!.rotation.z)
	},
	set(val) {
		if (!store.selectedObject) return
		store.selectedObject.rotation.z = THREE.MathUtils.degToRad(val)
	}
})

const formatOptions: NumberFieldRootProps['formatOptions'] = {
	style: 'unit',
	unitDisplay: 'narrow',
	unit: 'degree'
}
</script>
