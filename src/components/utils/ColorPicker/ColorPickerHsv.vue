<template>
	<div class="border border-ui-slider-outline rounded">
		<MxSlider
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
		</MxSlider>
	</div>
</template>

<script lang="ts" setup>
import type { IroColorPicker } from '@jaames/iro/dist/ColorPicker'
import { computed } from 'vue'
import { formatSliderValue } from './utils'

const model = defineModel<IroColorPicker['color']['hsva']>({ required: true })

const hue = computed({
	set(v: [number]) {
		model.value = { ...model.value, h: v[0] }
	},
	get() {
		return [model.value.h || 0]
	}
})

const saturation = computed({
	set(v: [number]) {
		model.value = { ...model.value, s: v[0] }
	},
	get() {
		return [model.value.s || 0]
	}
})

const value = computed({
	set(v: [number]) {
		model.value = { ...model.value, v: v[0] }
	},
	get() {
		return [model.value.v || 0]
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
		prop: 'hue',
		title: 'Hue',
		value: hue,
		min: 0,
		max: 360,
		step: 1
	},
	{
		prop: 'saturation',
		title: 'Saturation',
		value: saturation,
		min: 0,
		max: 100,
		step: 1
	},
	{
		prop: 'value',
		title: 'Value',
		value: value,
		min: 0,
		max: 100,
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
