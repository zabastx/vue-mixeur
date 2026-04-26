<template>
	<div v-if="store.selectedObject" class="flex flex-col items-end gap-0.5">
		<InputField label="Location X">
			<InputNumber v-model="store.selectedObject.position.x" :step="0.1" label="Location X" />
		</InputField>
		<InputField label="Y">
			<InputNumber v-model="store.selectedObject.position.y" :step="0.1" label="Y" />
		</InputField>
		<InputField label="Z">
			<InputNumber v-model="store.selectedObject.position.z" :step="0.1" label="Z" />
		</InputField>
	</div>
</template>

<script lang="ts" setup>
import { useThreeStore } from '@/store/three'

const store = useThreeStore()
</script>
