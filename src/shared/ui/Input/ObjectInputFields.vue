<template>
	<InputField
		v-for="field in fieldsList"
		:key="field.prop"
		v-slot="{ id, disabled }"
		input-width="150px"
		label-width="auto"
		:label="field.label"
		:tooltip="tooltipMap?.get(field.prop)"
	>
		<InputColor
			v-if="field.type === 'color'"
			:disabled
			:hex="getProp(field.type, field.prop)"
			@update:hex="setProp(field.type, field.prop, $event)"
		/>
		<InputTexture
			v-else-if="field.type === 'map'"
			:disabled
			:model-value="getProp(field.type, field.prop)"
			@update:model-value="setProp(field.type, field.prop, $event)"
		/>
		<InputTexture
			v-else-if="field.type === 'envMap'"
			:disabled
			is-env-map
			:model-value="getProp(field.type, field.prop)"
			@update:model-value="setProp(field.type, field.prop, $event)"
		/>
		<InputNumber
			v-else-if="field.type === 'number'"
			:disabled
			:model-value="getProp(field.type, field.prop)"
			:min="field.min"
			:max="field.max"
			:step="field.step"
			:format-options="field.formatOptions"
			@update:model-value="setProp(field.type, field.prop, $event)"
		/>
		<InputNumber
			v-else-if="field.type === 'angle'"
			:disabled
			:model-value="getProp(field.type, field.prop)"
			:min="field.min"
			:max="field.max"
			:step="field.step"
			:format-options="
				field.formatOptions ?? {
					style: 'unit',
					unitDisplay: 'narrow',
					unit: 'degree'
				}
			"
			@update:model-value="setProp(field.type, field.prop, $event)"
		/>
		<InputVector2
			v-else-if="field.type === 'vector2'"
			:disabled
			:min="field.min"
			:max="field.max"
			:step="field.step"
			:model-value="getProp(field.type, field.prop)"
			:format-options="field.formatOptions"
			@update:model-value="setProp(field.type, field.prop, $event)"
		/>
		<InputEuler
			v-else-if="field.type === 'euler'"
			:disabled
			:model-value="getProp(field.type, field.prop)"
			@update:model-value="setProp(field.type, field.prop, $event)"
		/>
		<InputCheckbox
			v-else-if="field.type === 'checkbox'"
			:id
			:disabled
			:model-value="getProp(field.type, field.prop)"
			@update:model-value="setProp(field.type, field.prop, $event)"
		/>
		<InputSelect
			v-else-if="field.type === 'select'"
			:disabled
			:model-value="getProp(field.type, field.prop)"
			:items="field.options"
			@update:model-value="setProp(field.type, field.prop, $event)"
		/>
	</InputField>
</template>

<script lang="ts" setup generic="T">
import { useInputFields } from '@/shared/lib/input-field'
import type { InputField } from '@/shared/lib/input-field/types'
import type { MxTooltipContent } from '@/shared/lib/types'

const { object } = defineProps<{
	fieldsList: InputField<T>[]
	object: T
	tooltipMap?: Map<string, MxTooltipContent> | ReadonlyMap<string, MxTooltipContent>
}>()

const { getProp, setProp } = useInputFields<T>(object)
</script>
