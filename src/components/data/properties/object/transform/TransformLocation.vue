<template>
	<div v-if="store.selectedObject" class="flex flex-col items-end gap-0.5">
		<InputNumber v-model="store.selectedObject.position.x" label="Location X" />
		<InputNumber v-model="store.selectedObject.position.y" label="Y" />
		<InputNumber v-model="store.selectedObject.position.z" label="Z" />
	</div>
</template>

<script lang="ts" setup>
import { useThreeStore } from '@/store/three'

const store = useThreeStore()
</script>
