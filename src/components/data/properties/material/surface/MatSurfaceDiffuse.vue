<template>
	<div v-if="material" class="flex flex-col items-end gap-1">
		<InputField label="Base Color">
			<InputColor v-model="color" class="w-[150px]" />
		</InputField>
	</div>
</template>

<script lang="ts" setup>
import { useShadingStore } from '@/store/shading'
import { useThreeStore } from '@/store/three'
import THREE from '@/three'
import { computed } from 'vue'

const shadingStore = useShadingStore()
const threeStore = useThreeStore()

const material = computed(() => {
	const obj = threeStore.selectedObject as THREE.Mesh | null
	if (!obj) return null
	obj.castShadow = true
	const mat = shadingStore.getMaterial(obj)?.original
	if (mat instanceof THREE.MeshLambertMaterial) {
		return mat
	}
	return null
})

const color = computed({
	set(v: string) {
		if (!material.value) return
		material.value.color.set(new THREE.Color(v))
	},
	get() {
		return `#${material.value?.color.getHexString()}`
	}
})
</script>
