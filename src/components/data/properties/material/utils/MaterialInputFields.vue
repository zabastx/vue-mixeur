<template>
	<template v-for="field in fieldsList" :key="field.prop">
		<InputField
			v-slot="{ id, disabled }"
			input-width="150px"
			label-width="auto"
			:label="field.label"
			:disabled="!(!field.showIf || getMaterialProp(field.showIf))"
			:tooltip="materialTooltipMap.get(field.prop)"
		>
			<InputColor
				v-if="field.type === 'color'"
				:disabled
				:hex="getPropValue(field.type, field.prop)"
				@update:hex="setPropValue(field.type, field.prop, $event)"
			/>
			<InputTexture
				v-else-if="field.type === 'map'"
				:disabled
				:model-value="getPropValue(field.type, field.prop)"
				@update:model-value="setPropValue(field.type, field.prop, $event)"
			/>
			<InputTexture
				v-else-if="field.type === 'envMap'"
				:disabled
				is-env-map
				:model-value="getPropValue(field.type, field.prop)"
				@update:model-value="setPropValue(field.type, field.prop, $event)"
			/>
			<InputNumber
				v-else-if="field.type === 'number'"
				:disabled
				:model-value="getPropValue(field.type, field.prop)"
				:min="field.min"
				:max="field.max"
				:step="field.step"
				@update:model-value="setPropValue(field.type, field.prop, $event)"
			/>
			<InputNumber
				v-else-if="field.type === 'angle'"
				:disabled
				:model-value="getPropValue(field.type, field.prop)"
				:min="field.min"
				:max="field.max"
				:step="field.step"
				:format-options="{
					style: 'unit',
					unitDisplay: 'narrow',
					unit: 'degree'
				}"
				@update:model-value="setPropValue(field.type, field.prop, $event)"
			/>
			<InputCheckbox
				v-else-if="field.type === 'checkbox'"
				:id
				:disabled
				:model-value="getPropValue(field.type, field.prop)"
				@update:model-value="setPropValue(field.type, field.prop, $event)"
			/>
			<InputSelect
				v-else-if="field.type === 'select'"
				:disabled
				:model-value="getPropValue(field.type, field.prop)"
				:items="field.options"
				@update:model-value="setPropValue(field.type, field.prop, $event)"
			/>
			<MxSlider
				v-else-if="field.type === 'range'"
				:disabled
				:model-value="getPropValue(field.type, field.prop)"
				:root="{
					min: field.min,
					max: field.max,
					step: field.step
				}"
				@update:model-value="setPropValue(field.type, field.prop, $event)"
			/>
		</InputField>
	</template>
</template>

<script lang="ts" setup generic="Mat extends THREE.Material">
import type THREE from '@/three'
import type { MaterialInputField } from './types'
import { useMeshMaterial } from '../material'
import { materialTooltipMap } from './tooltips'

defineProps<{
	fieldsList: MaterialInputField<Mat>[]
}>()

const { getPropValue, setPropValue, getMaterialProp } = useMeshMaterial<Mat>()
</script>
