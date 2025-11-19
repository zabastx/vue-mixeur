<template>
	<div class="flex flex-col items-end gap-1">
		<InputField input-width="150px" label="Color">
			<InputColor v-model:hex="emissive" />
		</InputField>
		<InputField input-width="150px" label="Map">
			<InputTexture v-model="emissiveMap" />
		</InputField>
		<InputField input-width="150px" label="Intensity">
			<InputNumber v-model="emissiveIntensity" :min="0" :step="0.01" />
		</InputField>
	</div>
</template>

<script lang="ts" setup>
import { useMeshMaterial } from '@/composables/material'
import THREE from '@/three'
import type {
	MeshLambertMaterial,
	MeshPhongMaterial,
	MeshPhysicalMaterial,
	MeshToonMaterial
} from 'three'
import { computed } from 'vue'

const { updateMaterialProp, getMaterialProp } = useMeshMaterial<
	MeshPhysicalMaterial | MeshToonMaterial | MeshPhongMaterial | MeshLambertMaterial
>()

const emissive = computed({
	set(v: string) {
		updateMaterialProp({ prop: 'emissive', value: new THREE.Color(v) })
	},
	get() {
		return `#${getMaterialProp<THREE.Color>('emissive')?.getHexString()}`
	}
})

const emissiveMap = computed({
	set(v: THREE.Texture) {
		updateMaterialProp({ prop: 'emissiveMap', value: v })
	},
	get() {
		return getMaterialProp<THREE.Texture>('emissiveMap')
	}
})

const emissiveIntensity = computed({
	set(v: number) {
		updateMaterialProp({ prop: 'emissiveIntensity', value: v })
	},
	get() {
		return getMaterialProp<number>('emissiveIntensity')
	}
})
</script>
