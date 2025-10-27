<template>
	<div v-if="store.selectedObject" class="flex flex-col items-end gap-0.5">
		<InputField label="Scale X">
			<InputNumber
				v-model="store.selectedObject.scale.x"
				:step="0.01"
				:format-options="formatOptions"
			/>
		</InputField>
		<InputField label="Y">
			<InputNumber
				v-model="store.selectedObject.scale.y"
				:format-options="formatOptions"
				:step="0.01"
			/>
		</InputField>
		<InputField label="Z">
			<InputNumber
				v-model="store.selectedObject.scale.z"
				:format-options="formatOptions"
				:step="0.01"
			/>
		</InputField>
	</div>
</template>

<script lang="ts" setup>
import { useThreeStore } from '@/store/three'
import type { NumberFieldRootProps } from 'reka-ui'

const store = useThreeStore()

const formatOptions: NumberFieldRootProps['formatOptions'] = {
	minimumFractionDigits: 3
}
</script>
