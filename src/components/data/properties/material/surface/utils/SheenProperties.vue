<template>
	<div class="flex flex-col items-end gap-1">
		<InputField input-width="150px" label="Intensity">
			<InputNumber v-model="sheen" :min="0" :max="1" :step="0.01" />
		</InputField>
		<InputField input-width="150px" label="Color">
			<InputColor v-model:hex="sheenColor" />
		</InputField>
		<InputField input-width="150px" label="Color Map">
			<InputTexture v-model="sheenColorMap" />
		</InputField>
		<InputField input-width="150px" label="Roughness">
			<InputNumber v-model="sheenRoughness" :min="0" :max="1" :step="0.01" />
		</InputField>
		<InputField input-width="150px" label="Roughness Map">
			<InputTexture v-model="sheenRoughnessMap" />
		</InputField>
	</div>
</template>

<script lang="ts" setup>
import { useMeshMaterial } from '@/composables/material'
import THREE from '@/three'
import type { MeshPhysicalMaterial } from 'three'
import { computed } from 'vue'

const { updateMaterialProp, getMaterialProp } = useMeshMaterial<MeshPhysicalMaterial>()

const sheen = computed({
	set(v: number) {
		updateMaterialProp({ prop: 'sheen', value: v })
	},
	get() {
		return getMaterialProp<number>('sheen')
	}
})

const sheenColor = computed({
	set(v: string) {
		updateMaterialProp({ prop: 'sheenColor', value: new THREE.Color(v) })
	},
	get() {
		return `#${getMaterialProp<THREE.Color>('sheenColor')?.getHexString()}`
	}
})

const sheenColorMap = computed({
	set(v: THREE.Texture) {
		updateMaterialProp({ prop: 'sheenColorMap', value: v })
	},
	get() {
		return getMaterialProp<THREE.Texture>('sheenColorMap')
	}
})

const sheenRoughness = computed({
	set(v: number) {
		updateMaterialProp({ prop: 'sheenRoughness', value: v })
	},
	get() {
		return getMaterialProp<number>('sheenRoughness')
	}
})

const sheenRoughnessMap = computed({
	set(v: THREE.Texture) {
		updateMaterialProp({ prop: 'sheenRoughnessMap', value: v })
	},
	get() {
		return getMaterialProp<THREE.Texture>('sheenRoughnessMap')
	}
})
</script>
