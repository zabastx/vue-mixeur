<template>
	<div class="border border-ui-slider-outline rounded">
		<MSlider
			v-for="item in fields"
			:key="item.prop"
			v-model="item.value.value"
			:root="{ min: item.min, max: item.max, step: item.step }"
			group
		>
			<div
				class="flex justify-between items-center text-ui-slider-text text-xs h-full relative z-1
					p-1"
			>
				<span>{{ item.title }}</span>
				<span>{{ formatSliderValue(item.value.value[0] || 0, item.max) }}</span>
			</div>
		</MSlider>
	</div>
</template>

<script lang="ts" setup>
import type { IroColorPicker } from '@jaames/iro/dist/ColorPicker'
import { computed } from 'vue'
import { formatSliderValue } from './utils'

const model = defineModel<IroColorPicker['color']['rgba']>({ required: true })

const red = computed({
	set(v: [number]) {
		model.value = { ...model.value, r: v[0] }
	},
	get() {
		return [model.value.r || 0]
	}
})

const green = computed({
	set(v: [number]) {
		model.value = { ...model.value, g: v[0] }
	},
	get() {
		return [model.value.g || 0]
	}
})

const blue = computed({
	set(v: [number]) {
		model.value = { ...model.value, b: v[0] }
	},
	get() {
		return [model.value.b || 0]
	}
})

const alpha = computed({
	set(v: [number]) {
		model.value = { ...model.value, a: v[0] }
	},
	get() {
		return [model.value.a || 0]
	}
})

const fields = [
	{
		prop: 'red',
		title: 'Red',
		value: red,
		min: 0,
		max: 255,
		step: 1
	},
	{
		prop: 'green',
		title: 'Green',
		value: green,
		min: 0,
		max: 255,
		step: 1
	},
	{
		prop: 'blue',
		title: 'Blue',
		value: blue,
		min: 0,
		max: 255,
		step: 1
	},
	{
		prop: 'alpha',
		title: 'Alpha',
		value: alpha,
		min: 0,
		max: 1,
		step: 0.001
	}
] as const
</script>
