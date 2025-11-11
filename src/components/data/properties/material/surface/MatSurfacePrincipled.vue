<template>
	<div v-if="material" class="flex flex-col items-end gap-1">
		<InputField input-width="150px" label="Base Color">
			<InputColor v-model="color" />
		</InputField>
		<InputField input-width="150px" label="Metallic">
			<InputNumber v-model="metalness" :min="0" :max="1" :step="0.01" />
		</InputField>
		<InputField input-width="150px" label="Roughness">
			<InputNumber v-model="roughness" :min="0" :max="1" :step="0.01" />
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
			<MAccordionItem label="Transmission" :item="{ value: 'transmission' }" class="w-full" nested>
				<div class="flex flex-col items-end gap-1">
					<InputField input-width="150px" label="Weight">
						<InputNumber v-model="transmission" :min="0" :max="1" :step="0.01" />
					</InputField>
				</div>
			</MAccordionItem>
			<MAccordionItem label="Coat" :item="{ value: 'coat' }" class="w-full" nested>
				<div class="flex flex-col items-end gap-1">
					<InputField input-width="150px" label="Weight">
						<InputNumber v-model="clearcoat" :min="0" :max="1" :step="0.01" />
					</InputField>
					<InputField input-width="150px" label="Roughness">
						<InputNumber v-model="clearcoatRoughness" :min="0" :max="1" :step="0.01" />
					</InputField>
				</div>
			</MAccordionItem>
			<MAccordionItem label="Emission" :item="{ value: 'emission' }" class="w-full" nested>
				<div class="flex flex-col items-end gap-1">
					<InputField input-width="150px" label="Color">
						<InputColor v-model="emissive" />
					</InputField>
					<InputField input-width="150px" label="Strength">
						<InputNumber v-model="emissiveIntensity" :min="0" :step="0.01" />
					</InputField>
				</div>
			</MAccordionItem>
		</MAccordionRoot>
	</div>
</template>

<script lang="ts" setup>
import { useShadingStore } from '@/store/shading'
import { useThreeStore } from '@/store/three'
import THREE from '@/three'
import { computed, ref, watch } from 'vue'

const shadingStore = useShadingStore()
const threeStore = useThreeStore()

const manualTrigger = ref(0)

const material = computed(() => {
	// oxlint-disable-next-line no-unused-expressions
	// eslint-disable-next-line @typescript-eslint/no-unused-expressions
	manualTrigger.value
	const obj = threeStore.selectedObject as THREE.Mesh | null
	if (!obj) return null
	const mat = shadingStore.getMaterial(obj)?.original
	if (mat instanceof THREE.MeshPhysicalMaterial || mat instanceof THREE.MeshStandardMaterial) {
		return mat
	}
	return null
})

// Automatically convert MeshStandardMaterial to MeshPhysicalMaterial on load
// This ensures the component always works with the full PBR material model (Principled BSDF)
watch(
	material,
	(mat) => {
		if (!mat) return
		const obj = threeStore.selectedObject
		if (!(obj instanceof THREE.Mesh)) return

		if (mat instanceof THREE.MeshStandardMaterial && !(mat instanceof THREE.MeshPhysicalMaterial)) {
			const physicalMaterial = convertToPhysicalMaterial(mat)
			shadingStore.changeMaterial(obj, physicalMaterial)
			manualTrigger.value++
		}
	},
	{ immediate: true }
)

const color = computed({
	set(v: string) {
		const obj = threeStore.selectedObject
		if (!(obj instanceof THREE.Mesh)) return
		shadingStore.updateMaterial(obj, { prop: 'color', value: new THREE.Color(v) })
		manualTrigger.value++
	},
	get() {
		return `#${material.value?.color.getHexString()}`
	}
})

const metalness = computed({
	set(v: number) {
		const obj = threeStore.selectedObject
		if (!(obj instanceof THREE.Mesh)) return
		shadingStore.updateMaterial(obj, { prop: 'metalness', value: v })
		manualTrigger.value++
	},
	get() {
		return getMaterialProp('metalness') as number | undefined
	}
})

const roughness = computed({
	set(v: number) {
		const obj = threeStore.selectedObject
		if (!(obj instanceof THREE.Mesh)) return
		shadingStore.updateMaterial(obj, { prop: 'roughness', value: v })
		manualTrigger.value++
	},
	get() {
		return getMaterialProp('roughness') as number | undefined
	}
})

const ior = computed({
	set(v: number) {
		const obj = threeStore.selectedObject
		if (!(obj instanceof THREE.Mesh)) return
		shadingStore.updateMaterial(obj, { prop: 'ior', value: v })
		manualTrigger.value++
	},
	get() {
		return getMaterialProp('ior') as number | undefined
	}
})

const transparent = computed({
	set(v: number) {
		const obj = threeStore.selectedObject
		if (!(obj instanceof THREE.Mesh)) return
		shadingStore.updateMaterial(obj, { prop: 'transparent', value: v })
		manualTrigger.value++
	},
	get() {
		return getMaterialProp('transparent') as boolean | undefined
	}
})

const opacity = computed({
	set(v: number) {
		const obj = threeStore.selectedObject
		if (!(obj instanceof THREE.Mesh)) return
		shadingStore.updateMaterial(obj, { prop: 'opacity', value: v })
		manualTrigger.value++
	},
	get() {
		return getMaterialProp('opacity') as number | undefined
	}
})

const transmission = computed({
	set(v: number) {
		const obj = threeStore.selectedObject
		if (!(obj instanceof THREE.Mesh)) return
		shadingStore.updateMaterial(obj, { prop: 'transmission', value: v })
		manualTrigger.value++
	},
	get() {
		return getMaterialProp('transmission') as number | undefined
	}
})

const clearcoat = computed({
	set(v: number) {
		const obj = threeStore.selectedObject
		if (!(obj instanceof THREE.Mesh)) return
		shadingStore.updateMaterial(obj, { prop: 'clearcoat', value: v })
		manualTrigger.value++
	},
	get() {
		return getMaterialProp('clearcoat') as number | undefined
	}
})

const clearcoatRoughness = computed({
	set(v: number) {
		const obj = threeStore.selectedObject
		if (!(obj instanceof THREE.Mesh)) return
		shadingStore.updateMaterial(obj, { prop: 'clearcoatRoughness', value: v })
		manualTrigger.value++
	},
	get() {
		return getMaterialProp('clearcoatRoughness') as number | undefined
	}
})

const emissive = computed({
	set(v: string) {
		const obj = threeStore.selectedObject
		if (!(obj instanceof THREE.Mesh)) return
		shadingStore.updateMaterial(obj, { prop: 'emissive', value: new THREE.Color(v) })
		manualTrigger.value++
	},
	get() {
		return `#${material.value?.emissive.getHexString()}`
	}
})

const emissiveIntensity = computed({
	set(v: number) {
		const obj = threeStore.selectedObject
		if (!(obj instanceof THREE.Mesh)) return
		shadingStore.updateMaterial(obj, { prop: 'emissiveIntensity', value: v })
		manualTrigger.value++
	},
	get() {
		return getMaterialProp('emissiveIntensity') as number | undefined
	}
})

function getMaterialProp(prop: string) {
	if (!material.value) return
	// oxlint-disable-next-line no-unused-expressions
	// eslint-disable-next-line @typescript-eslint/no-unused-expressions
	manualTrigger.value
	return (material.value as unknown as Record<string, unknown>)[prop]
}

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
