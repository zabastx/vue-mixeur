<template>
	<div v-if="store.selectedObject" class="flex flex-col items-end gap-0.5">
		<InputNumber v-model="store.selectedObject.scale.x" label="Scale X" />
		<InputNumber v-model="store.selectedObject.scale.y" label="Y" />
		<InputNumber v-model="store.selectedObject.scale.z" label="Z" />
	</div>
</template>

<script lang="ts" setup>
import { useThreeStore } from '@/store/three'

const store = useThreeStore()
</script>
