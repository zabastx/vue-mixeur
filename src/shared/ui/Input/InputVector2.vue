<template>
	<div>
		<InputField label="X">
			<InputNumber v-model="x" :min :max :step :format-options />
		</InputField>
		<InputField label="Y">
			<InputNumber v-model="y" :min :max :step :format-options />
		</InputField>
	</div>
</template>

<script lang="ts" setup>
import THREE from '@/shared/three'
import { computed } from 'vue'

defineProps<{
	min?: number
	max?: number
	step?: number
	formatOptions?: Intl.NumberFormatOptions
}>()

const model = defineModel<THREE.Vector2>({
	required: true
})

const x = computed<number>({
	set(val) {
		model.value = new THREE.Vector2(val, y.value)
	},
	get() {
		return model.value.x
	}
})

const y = computed<number>({
	set(val) {
		model.value = new THREE.Vector2(x.value, val)
	},
	get() {
		return model.value.y
	}
})
</script>
