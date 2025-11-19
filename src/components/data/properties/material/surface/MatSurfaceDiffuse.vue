<template>
	<div v-if="material" class="flex flex-col items-end gap-1">
		<InputField label="Base Color" input-width="150px">
			<InputColor v-model:hex="color" />
		</InputField>
		<MAccordionItem label="Emission" :item="{ value: 'emission' }" class="w-full" nested>
			<EmissionProperties />
		</MAccordionItem>
	</div>
</template>

<script lang="ts" setup>
import { useMeshMaterial } from '@/composables/material'
import THREE from '@/three'
import { computed } from 'vue'

const { material, updateMaterialProp, getMaterialProp } =
	useMeshMaterial<THREE.MeshLambertMaterial>()

const color = computed({
	set(v: string) {
		updateMaterialProp({ prop: 'color', value: new THREE.Color(v) })
	},
	get() {
		return `#${getMaterialProp<THREE.Color>('color')?.getHexString()}`
	}
})
</script>
