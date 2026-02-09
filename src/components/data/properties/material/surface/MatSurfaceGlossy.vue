<template>
	<div v-if="material">
		<div class="flex flex-col items-end gap-1 p-1 pr-3">
			<InputField input-width="150px" label="Base Color">
				<InputColor v-model:hex="color" />
			</InputField>
		</div>
		<MAccordionItem label="Specular" :item="{ value: 'specular' }" class="w-full" nested>
			<div class="flex flex-col items-end gap-1 p-1 pr-3">
				<InputField input-width="150px" label="Color">
					<InputColor v-model:hex="specular" />
				</InputField>
				<InputField input-width="150px" label="Map">
					<InputTexture v-model="specularMap" />
				</InputField>
			</div>
		</MAccordionItem>
		<MAccordionItem label="Emission" :item="{ value: 'emission' }" class="w-full" nested>
			<EmissionProperties />
		</MAccordionItem>
	</div>
</template>

<script lang="ts" setup>
import { useMeshMaterial } from '@/composables/material'
import THREE from '@/three'
import { computed } from 'vue'

const { material, updateMaterialProp, getMaterialProp } = useMeshMaterial<THREE.MeshPhongMaterial>()

const color = computed({
	set(v: string) {
		updateMaterialProp({ prop: 'color', value: new THREE.Color(v) })
	},
	get() {
		return `#${getMaterialProp<THREE.Color>('color')?.getHexString()}`
	}
})

const specular = computed({
	set(v: string) {
		updateMaterialProp({ prop: 'specular', value: new THREE.Color(v) })
	},
	get() {
		return `#${getMaterialProp<THREE.Color>('specular')?.getHexString()}`
	}
})

const specularMap = computed({
	set(v: THREE.Texture) {
		updateMaterialProp({ prop: 'specularMap', value: v })
	},
	get() {
		return getMaterialProp<THREE.Texture>('specularMap')
	}
})
</script>
