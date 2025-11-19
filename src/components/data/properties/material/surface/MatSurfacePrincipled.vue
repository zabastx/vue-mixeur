<template>
	<div v-if="material" class="flex flex-col items-end gap-1">
		<InputField input-width="150px" label="Base Color">
			<InputColor v-model:hex="color" />
		</InputField>
		<InputField input-width="150px" label="Map">
			<InputTexture v-model="map" />
		</InputField>
		<InputField input-width="150px" label="Metallic">
			<InputNumber v-model="metalness" :min="0" :max="1" :step="0.01" />
		</InputField>
		<InputField input-width="150px" label="Metalness Map">
			<InputTexture v-model="metalnessMap" />
		</InputField>
		<InputField input-width="150px" label="Roughness">
			<InputNumber v-model="roughness" :min="0" :max="1" :step="0.01" />
		</InputField>
		<InputField input-width="150px" label="Roughness Map">
			<InputTexture v-model="roughnessMap" />
		</InputField>
		<InputField input-width="150px" label="IOR">
			<InputNumber v-model="ior" :min="1" :max="2.333" :step="0.01" />
		</InputField>
		<InputField input-width="150px" label="Transparent">
			<div>
				<InputCheckbox v-model="transparent" />
			</div>
		</InputField>
		<InputField v-if="transparent" input-width="150px" label="Alpha">
			<InputNumber v-model="opacity" :min="0" :max="1" :step="0.01" />
		</InputField>
		<MAccordionRoot collapsible type="multiple" class="w-full">
			<MAccordionItem label="Specular" :item="{ value: 'specular' }" class="w-full" nested>
				<SpecularProperties />
			</MAccordionItem>
			<MAccordionItem label="Transmission" :item="{ value: 'transmission' }" class="w-full" nested>
				<TransmissionProperties />
			</MAccordionItem>
			<MAccordionItem label="Coat" :item="{ value: 'coat' }" class="w-full" nested>
				<ClearcoatProperties />
			</MAccordionItem>
			<MAccordionItem label="Sheen" :item="{ value: 'sheen' }" class="w-full" nested>
				<SheenProperties />
			</MAccordionItem>
			<MAccordionItem label="Emission" :item="{ value: 'emission' }" class="w-full" nested>
				<EmissionProperties />
			</MAccordionItem>
		</MAccordionRoot>
	</div>
</template>

<script lang="ts" setup>
import { useMeshMaterial } from '@/composables/material'
import THREE from '@/three'
import { computed, watch } from 'vue'
import EmissionProperties from './utils/EmissionProperties.vue'

const { material, updateMaterialProp, getMaterialProp, selectedObject, changeMaterial } =
	useMeshMaterial<THREE.MeshPhysicalMaterial>()

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

const metalness = computed({
	set(v: number) {
		updateMaterialProp({ prop: 'metalness', value: v })
	},
	get() {
		return getMaterialProp<number>('metalness')
	}
})

const metalnessMap = computed({
	set(v: THREE.Texture) {
		updateMaterialProp({ prop: 'metalnessMap', value: v })
	},
	get() {
		return getMaterialProp<THREE.Texture>('metalnessMap')
	}
})

const roughness = computed({
	set(v: number) {
		updateMaterialProp({ prop: 'roughness', value: v })
	},
	get() {
		return getMaterialProp<number>('roughness')
	}
})

const roughnessMap = computed({
	set(v: THREE.Texture) {
		updateMaterialProp({ prop: 'roughnessMap', value: v })
	},
	get() {
		return getMaterialProp<THREE.Texture>('roughnessMap')
	}
})

const ior = computed({
	set(v: number) {
		updateMaterialProp({ prop: 'ior', value: v })
	},
	get() {
		return getMaterialProp<number>('ior')
	}
})

const transparent = computed({
	set(v: number) {
		updateMaterialProp({ prop: 'transparent', value: v })
	},
	get() {
		return getMaterialProp<boolean>('transparent')
	}
})

const opacity = computed({
	set(v: number) {
		updateMaterialProp({ prop: 'opacity', value: v })
	},
	get() {
		return getMaterialProp<number>('opacity')
	}
})

// Automatically convert MeshStandardMaterial to MeshPhysicalMaterial on load
// This ensures the component always works with the full PBR material model (Principled BSDF)
watch(
	material,
	(mat) => {
		const obj = selectedObject.value
		if (!obj || !mat) return

		if (mat instanceof THREE.MeshStandardMaterial && !(mat instanceof THREE.MeshPhysicalMaterial)) {
			const physicalMaterial = convertToPhysicalMaterial(mat)
			changeMaterial(physicalMaterial)
		}
	},
	{ immediate: true }
)

/**
 * Convert MeshStandardMaterial to MeshPhysicalMaterial
 * Preserves all common properties and texture maps
 */
function convertToPhysicalMaterial(
	standardMaterial: THREE.MeshStandardMaterial
): THREE.MeshPhysicalMaterial {
	const physicalMaterial = new THREE.MeshPhysicalMaterial()

	// Copy all common properties
	physicalMaterial.color.copy(standardMaterial.color)
	physicalMaterial.metalness = standardMaterial.metalness
	physicalMaterial.roughness = standardMaterial.roughness
	physicalMaterial.transparent = standardMaterial.transparent
	physicalMaterial.opacity = standardMaterial.opacity
	physicalMaterial.emissive.copy(standardMaterial.emissive)
	physicalMaterial.emissiveIntensity = standardMaterial.emissiveIntensity
	physicalMaterial.side = standardMaterial.side
	physicalMaterial.flatShading = standardMaterial.flatShading
	physicalMaterial.wireframe = standardMaterial.wireframe
	physicalMaterial.vertexColors = standardMaterial.vertexColors
	physicalMaterial.fog = standardMaterial.fog
	physicalMaterial.dithering = standardMaterial.dithering

	// Copy texture maps
	physicalMaterial.map = standardMaterial.map
	physicalMaterial.normalMap = standardMaterial.normalMap
	physicalMaterial.normalMapType = standardMaterial.normalMapType
	physicalMaterial.normalScale.copy(standardMaterial.normalScale)
	physicalMaterial.aoMap = standardMaterial.aoMap
	physicalMaterial.aoMapIntensity = standardMaterial.aoMapIntensity
	physicalMaterial.emissiveMap = standardMaterial.emissiveMap
	physicalMaterial.bumpMap = standardMaterial.bumpMap
	physicalMaterial.bumpScale = standardMaterial.bumpScale
	physicalMaterial.displacementMap = standardMaterial.displacementMap
	physicalMaterial.displacementScale = standardMaterial.displacementScale
	physicalMaterial.displacementBias = standardMaterial.displacementBias
	physicalMaterial.roughnessMap = standardMaterial.roughnessMap
	physicalMaterial.metalnessMap = standardMaterial.metalnessMap
	physicalMaterial.alphaMap = standardMaterial.alphaMap
	physicalMaterial.envMap = standardMaterial.envMap
	physicalMaterial.envMapIntensity = standardMaterial.envMapIntensity
	physicalMaterial.lightMap = standardMaterial.lightMap
	physicalMaterial.lightMapIntensity = standardMaterial.lightMapIntensity

	standardMaterial.dispose()

	return physicalMaterial
}
</script>
