<template>
	<div v-if="material">
		<div class="p-1 pr-3 flex flex-col items-end gap-1">
			<InputField input-width="150px" label="Base Color">
				<InputColor v-model:hex="color" />
			</InputField>
			<InputField input-width="150px" label="Map">
				<InputTexture v-model="map" />
			</InputField>
			<InputField input-width="150px" label="Gradient Map">
				<InputTexture v-model="gradientMap" />
			</InputField>
		</div>
		<MxAccordionItem label="Emission" :item="{ value: 'emission' }" class="w-full" nested>
			<EmissionProperties />
		</MxAccordionItem>
	</div>
</template>

<script lang="ts" setup>
import { useMeshMaterial } from '@/composables/material'
import THREE from '@/three'
import { computed } from 'vue'

const { material, updateMaterialProp, getMaterialProp } = useMeshMaterial<THREE.MeshToonMaterial>()

const color = computed({
	set(v: string) {
		updateMaterialProp({ prop: 'color', value: new THREE.Color(v) })
	},
	get() {
		return `#${getMaterialProp<THREE.Color>('color')?.getHexString()}`
	}
})

const map = computed({
	set(v: THREE.Texture) {
		updateMaterialProp({ prop: 'map', value: v })
	},
	get() {
		return getMaterialProp<THREE.Texture>('map')
	}
})

const gradientMap = computed({
	set(v: THREE.Texture) {
		updateMaterialProp({ prop: 'gradientMap', value: v })
	},
	get() {
		return getMaterialProp<THREE.Texture>('gradientMap')
	}
})
</script>
