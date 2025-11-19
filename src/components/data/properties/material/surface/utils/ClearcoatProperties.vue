<template>
	<div class="flex flex-col items-end gap-1">
		<InputField input-width="150px" label="Intensity">
			<InputNumber v-model="clearcoat" :min="0" :max="1" :step="0.01" />
		</InputField>
		<InputField input-width="150px" label="Map">
			<InputTexture v-model="clearcoatMap" />
		</InputField>
		<InputField input-width="150px" label="Normal Map">
			<InputTexture v-model="clearcoatNormalMap" />
		</InputField>
		<InputField input-width="150px" label="Roughness">
			<InputNumber v-model="clearcoatRoughness" :min="0" :max="1" :step="0.01" />
		</InputField>
		<InputField input-width="150px" label="Roughness Map">
			<InputTexture v-model="clearcoatRoughnessMap" />
		</InputField>
	</div>
</template>

<script lang="ts" setup generic="T">
import { useMeshMaterial } from '@/composables/material'
import type THREE from '@/three'
import type { MeshPhysicalMaterial } from 'three'
import { computed } from 'vue'

const { updateMaterialProp, getMaterialProp } = useMeshMaterial<MeshPhysicalMaterial>()

const clearcoat = computed({
	set(v: number) {
		updateMaterialProp({ prop: 'clearcoat', value: v })
	},
	get() {
		return getMaterialProp<number>('clearcoat')
	}
})

const clearcoatMap = computed({
	set(v: THREE.Texture) {
		updateMaterialProp({ prop: 'clearcoatMap', value: v })
	},
	get() {
		return getMaterialProp<THREE.Texture>('clearcoatMap')
	}
})

const clearcoatNormalMap = computed({
	set(v: THREE.Texture) {
		updateMaterialProp({ prop: 'clearcoatNormalMap', value: v })
	},
	get() {
		return getMaterialProp<THREE.Texture>('clearcoatNormalMap')
	}
})

const clearcoatRoughness = computed({
	set(v: number) {
		updateMaterialProp({ prop: 'clearcoatRoughness', value: v })
	},
	get() {
		return getMaterialProp<number>('clearcoatRoughness')
	}
})

const clearcoatRoughnessMap = computed({
	set(v: THREE.Texture) {
		updateMaterialProp({ prop: 'clearcoatRoughnessMap', value: v })
	},
	get() {
		return getMaterialProp<THREE.Texture>('clearcoatRoughnessMap')
	}
})
</script>
