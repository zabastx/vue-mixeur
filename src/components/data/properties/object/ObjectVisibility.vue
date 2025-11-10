<template>
	<div class="flex flex-col items-end gap-1">
		<InputField label="Cast shadow">
			<InputCheckbox v-model="object.castShadow" />
		</InputField>
		<InputField label="Receive shadow">
			<InputCheckbox v-model="object.receiveShadow" />
		</InputField>
	</div>
</template>

<script lang="ts" setup>
import { useThreeStore } from '@/store/three'
import type THREE from '@/three'
import { computed } from 'vue'

const threeStore = useThreeStore()

const object = computed(() => threeStore.selectedObject as THREE.Object3D)
</script>
