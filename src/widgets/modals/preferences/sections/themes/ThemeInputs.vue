<template>
	<div class="grid grid-cols-2 gap-1 p-2 justify-items-end *:last:not-even:col-span-2">
		<InputField
			v-for="field in fields"
			:key="field.key"
			:label="field.label"
			input-width="200px"
			label-width="auto"
		>
			<InputColor
				v-if="field.type === 'color'"
				:transparency="field.transparent"
				:hex="getPropertyValue(field.key)"
				@update:hex="setProperty(field.key, $event)"
			/>
			<InputNumber
				v-else-if="field.type === 'number'"
				:min="0"
				:max="1"
				:step="0.01"
				:model-value="Number(getPropertyValue(field.key))"
				@update:model-value="setProperty(field.key, $event)"
			/>
		</InputField>
	</div>
</template>

<script lang="ts" setup>
import { usePreferencesStore } from '@/app/model/preferences'
import type { ThemeInputField } from './types'

defineProps<{
	fields: ThemeInputField[]
}>()

const { getPropertyValue, setProperty } = usePreferencesStore()
</script>
