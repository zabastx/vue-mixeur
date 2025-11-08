<template>
	<div v-if="material" class="flex flex-col items-end gap-1">
		<InputField label="Base Color">
			<InputColor v-model="color" class="w-[150px]" />
		</InputField>
		<InputField label="Metallic">
			<InputNumber v-model="metalness" :min="0" :max="1" :step="0.01" class="w-[150px]" />
		</InputField>
		<InputField label="Roughness">
			<InputNumber v-model="roughness" :min="0" :max="1" :step="0.01" class="w-[150px]" />
		</InputField>
		<InputField label="IOR">
			<InputNumber v-model="ior" :min="1" :max="2.333" :step="0.01" class="w-[150px]" />
		</InputField>
		<InputField label="Transparent">
			<div class="w-[150px]">
				<InputCheckbox v-model="transparent" />
			</div>
		</InputField>
		<InputField v-if="transparent" label="Alpha">
			<InputNumber v-model="opacity" :min="0" :max="1" :step="0.01" class="w-[150px]" />
		</InputField>
		<MAccordionRoot collapsible type="multiple" class="w-full">
			<MAccordionItem label="Transmission" :item="{ value: 'transmission' }" class="w-full" nested>
				<div class="flex flex-col items-end gap-1">
					<InputField label="Weight">
						<InputNumber v-model="transmission" :min="0" :max="1" :step="0.01" class="w-[150px]" />
					</InputField>
				</div>
			</MAccordionItem>
			<MAccordionItem label="Coat" :item="{ value: 'coat' }" class="w-full" nested>
				<div class="flex flex-col items-end gap-1">
					<InputField label="Weight">
						<InputNumber v-model="clearcoat" :min="0" :max="1" :step="0.01" class="w-[150px]" />
					</InputField>
					<InputField label="Roughness">
						<InputNumber
							v-model="clearcoatRoughness"
							:min="0"
							:max="1"
							:step="0.01"
							class="w-[150px]"
						/>
					</InputField>
				</div>
			</MAccordionItem>
			<MAccordionItem label="Emission" :item="{ value: 'emission' }" class="w-full" nested>
				<div class="flex flex-col items-end gap-1">
					<InputField label="Color">
						<InputColor v-model="emissive" class="w-[150px]" />
					</InputField>
					<InputField label="Strength">
						<InputNumber v-model="emissiveIntensity" :min="0" :step="0.01" class="w-[150px]" />
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
import { computed, ref } from 'vue'

const shadingStore = useShadingStore()
const threeStore = useThreeStore()

const manualTrigger = ref(0)

const material = computed(() => {
	const obj = threeStore.selectedObject as THREE.Mesh | null
	if (!obj) return null
	obj.castShadow = true
	const mat = shadingStore.getMaterial(obj)?.original
	if (mat instanceof THREE.MeshPhysicalMaterial) {
		return mat
	}
	return null
})

const color = computed({
	set(v: string) {
		if (!material.value) return
		material.value.color.set(new THREE.Color(v))
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
		if (!material.value) return
		material.value.emissive.set(new THREE.Color(v))
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

function getMaterialProp(prop: keyof THREE.MeshPhysicalMaterial) {
	if (!material.value) return
	// oxlint-disable-next-line no-unused-expressions
	// eslint-disable-next-line @typescript-eslint/no-unused-expressions
	manualTrigger.value
	return material.value[prop]
}
</script>
