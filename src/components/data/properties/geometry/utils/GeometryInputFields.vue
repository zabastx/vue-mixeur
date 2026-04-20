<template>
	<InputField
		v-for="field in fields"
		:key="field.key"
		:label="field.label"
		:tooltip="field.tooltip"
		input-width="150px"
	>
		<InputNumber
			v-if="field.type === 'float'"
			v-model="data[field.key]"
			:min="field.min"
			:max="field.max"
			:step="field.step ?? 0.1"
		/>
		<InputNumber
			v-else-if="field.type === 'integer'"
			v-model="data[field.key]"
			:min="field.min"
			:max="field.max"
			:format-options="{ maximumFractionDigits: 0 }"
		/>
		<InputNumber
			v-else-if="field.type === 'angle'"
			v-model="data[field.key]"
			:min="field.min"
			:max="field.max"
			:step="field.step"
			:format-options="{
				style: 'unit',
				unitDisplay: 'narrow',
				unit: 'degree'
			}"
		/>
		<InputCheckbox v-else-if="field.type === 'boolean'" v-model="data[field.key]" />
	</InputField>
</template>

<script lang="ts" setup generic="T extends Record<string, any>">
import type { GeometryField } from './types'

defineProps<{
	fields: GeometryField<T>[]
}>()

const data = defineModel<T>({ required: true })
</script>
