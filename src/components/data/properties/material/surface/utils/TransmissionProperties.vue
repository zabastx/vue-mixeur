<template>
	<div class="flex flex-col items-end gap-1">
		<InputField input-width="150px" label="Weight">
			<InputNumber v-model="transmission" :min="0" :max="1" :step="0.01" />
		</InputField>
		<InputField input-width="150px" label="Map">
			<InputTexture v-model="transmissionMap" />
		</InputField>
	</div>
</template>

<script lang="ts" setup>
import { useMeshMaterial } from '@/composables/material'
import type THREE from '@/three'
import type { MeshPhysicalMaterial } from 'three'
import { computed } from 'vue'

const { updateMaterialProp, getMaterialProp } = useMeshMaterial<MeshPhysicalMaterial>()

const transmission = computed({
	set(v: number) {
		updateMaterialProp({ prop: 'transmission', value: v })
	},
	get() {
		return getMaterialProp<number>('transmission')
	}
})

const transmissionMap = computed({
	set(v: THREE.Texture) {
		updateMaterialProp({ prop: 'transmissionMap', value: v })
	},
	get() {
		return getMaterialProp<THREE.Texture>('transmissionMap')
	}
})
</script>
