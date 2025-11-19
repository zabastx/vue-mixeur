<template>
	<div class="flex flex-col items-end gap-1">
		<InputField input-width="150px" label="Color">
			<InputColor v-model:hex="color" />
		</InputField>
		<InputField input-width="150px" label="Map">
			<InputTexture v-model="colorMap" />
		</InputField>
		<InputField input-width="150px" label="Intensity">
			<InputNumber v-model="intensity" :min="0" :max="1" :step="0.01" />
		</InputField>
		<InputField input-width="150px" label="Intensity Map">
			<InputTexture v-model="intensityMap" />
		</InputField>
	</div>
</template>

<script lang="ts" setup>
import { useMeshMaterial } from '@/composables/material'
import THREE from '@/three'
import type { MeshPhysicalMaterial } from 'three'
import { computed } from 'vue'

const { updateMaterialProp, getMaterialProp } = useMeshMaterial<MeshPhysicalMaterial>()

const color = computed({
	set(v: string) {
		updateMaterialProp({ prop: 'specularColor', value: new THREE.Color(v) })
	},
	get() {
		return `#${getMaterialProp<THREE.Color>('specularColor')?.getHexString()}`
	}
})

const colorMap = computed({
	set(v: THREE.Texture) {
		updateMaterialProp({ prop: 'specularColorMap', value: v })
	},
	get() {
		return getMaterialProp<THREE.Texture>('specularColorMap')
	}
})

const intensity = computed({
	set(v: number) {
		updateMaterialProp({ prop: 'specularIntensity', value: v })
	},
	get() {
		return getMaterialProp<number>('specularIntensity')
	}
})

const intensityMap = computed({
	set(v: THREE.Texture) {
		updateMaterialProp({ prop: 'specularIntensityMap', value: v })
	},
	get() {
		return getMaterialProp<THREE.Texture>('specularIntensityMap')
	}
})
</script>
