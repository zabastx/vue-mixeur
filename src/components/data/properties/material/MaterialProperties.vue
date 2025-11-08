<template>
	<div v-if="meshMaterial">
		<MAccordionRoot collapsible type="multiple">
			<MAccordionItem label="Surface" :item="{ value: 'surface' }">
				<InputField label="Surface" class="ml-auto w-fit mb-4">
					<InputSelect v-model="matType" :items class="w-[150px]" />
				</InputField>
				<SurfaceOptionsWrapper v-if="matType" :type="matType.value" />
			</MAccordionItem>
		</MAccordionRoot>
	</div>
</template>

<script lang="ts" setup>
import { useShadingStore } from '@/store/shading'
import { useThreeStore } from '@/store/three'
import THREE from '@/three'
import type { AcceptableValue } from 'reka-ui'
import { computed, ref, watch } from 'vue'

const threeStore = useThreeStore()
const shadingStore = useShadingStore()

const selectedObject = computed(() => threeStore.selectedObject)

const meshMaterial = computed(() => {
	if (selectedObject.value instanceof THREE.Mesh) {
		return shadingStore.getMaterial(selectedObject.value)?.original || null
	}
	return null
})

const items = [
	{
		label: 'Principled BSDF',
		value: 'principled_bsdf'
	},
	{
		label: 'Diffuse BSDF',
		value: 'diffuse_bsdf'
	}
] as const satisfies AcceptableValue[]

type MaterialType = (typeof items)[number]['value']

const matType = ref<
	| {
			value: MaterialType
			label: string
	  }
	| undefined
>(getInitialType())

watch(matType, (val) => {
	if (!val || !(selectedObject.value instanceof THREE.Mesh)) return
	switch (val.value) {
		case 'principled_bsdf':
			shadingStore.changeMaterial(selectedObject.value, new THREE.MeshPhysicalMaterial())
			break
		case 'diffuse_bsdf':
			shadingStore.changeMaterial(selectedObject.value, new THREE.MeshLambertMaterial())
			break
	}
})

function getInitialType() {
	const mat = Array.isArray(meshMaterial.value) ? meshMaterial.value[0] : meshMaterial.value
	if (!mat) return
	let value: MaterialType
	switch (mat.type) {
		case 'MeshPhysicalMaterial':
			value = 'principled_bsdf'
			break
		case 'MeshLambertMaterial':
			value = 'diffuse_bsdf'
			break
	}
	return items.find((item) => item.value === value)
}
</script>
