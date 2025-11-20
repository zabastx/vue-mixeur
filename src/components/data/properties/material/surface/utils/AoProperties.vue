<template>
	<div class="flex flex-col items-end gap-1 panel-content">
		<InputField input-width="150px" label="Map">
			<InputTexture v-model="aoMap" />
		</InputField>
		<InputField input-width="150px" label="Intensity">
			<InputNumber v-model="aoMapIntensity" :min="0" :step="0.01" />
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

const aoMap = computed({
	set(v: THREE.Texture) {
		updateMaterialProp({ prop: 'aoMap', value: v })
	},
	get() {
		return getMaterialProp<THREE.Texture>('aoMap')
	}
})

const aoMapIntensity = computed({
	set(v: number) {
		updateMaterialProp({ prop: 'aoMapIntensity', value: v })
	},
	get() {
		return getMaterialProp<number>('aoMapIntensity')
	}
})
</script>
