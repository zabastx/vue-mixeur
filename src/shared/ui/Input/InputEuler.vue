<template>
	<div>
		<InputField label="X">
			<InputNumber v-model="x" :min :max :step :format-options />
		</InputField>
		<InputField label="Y">
			<InputNumber v-model="y" :min :max :step :format-options />
		</InputField>
		<InputField label="Z">
			<InputNumber v-model="z" :min :max :step :format-options />
		</InputField>
	</div>
</template>

<script lang="ts" setup>
import type THREE from '@/shared/three'
import { MathUtils } from 'three'
import { computed, triggerRef } from 'vue'

defineProps<{
	min?: number
	max?: number
	step?: number
}>()

const model = defineModel<THREE.Euler>({
	required: true
})

const x = computed<number>({
	set(val) {
		model.value.x = MathUtils.degToRad(val)
		triggerRef(model)
	},
	get() {
		return MathUtils.radToDeg(model.value.x)
	}
})

const y = computed<number>({
	set(val) {
		model.value.y = MathUtils.degToRad(val)
		triggerRef(model)
	},
	get() {
		return MathUtils.radToDeg(model.value.y)
	}
})

const z = computed<number>({
	set(val) {
		model.value.z = MathUtils.degToRad(val)
		triggerRef(model)
	},
	get() {
		return MathUtils.radToDeg(model.value.z)
	}
})

const formatOptions: Intl.NumberFormatOptions = {
	unit: 'degree',
	unitDisplay: 'narrow',
	style: 'unit'
}
</script>
