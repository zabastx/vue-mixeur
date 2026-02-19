<template>
	<div v-if="meshMaterial">
		<MxAccordionRoot collapsible type="multiple">
			<MxAccordionItem label="Surface" :item="{ value: 'surface' }">
				<div class="pl-1 pt-1 pr-3">
					<InputField label="Surface" class="ml-auto w-fit mb-4">
						<InputSelect v-model="matType" :items class="w-[150px]" />
					</InputField>
				</div>
				<component :is="getSurfaceComponent(matType)" v-if="matType" />
			</MxAccordionItem>
		</MxAccordionRoot>
	</div>
</template>

<script lang="ts" setup>
import { useShadingStore } from '@/store/shading'
import { useThreeStore } from '@/store/three'
import THREE from '@/three'
import type { AcceptableValue } from 'reka-ui'
import { computed, ref, watch } from 'vue'
import MatSurfaceDiffuse from './surface/MatSurfaceDiffuse.vue'
import MatSurfacePrincipled from './surface/MatSurfacePrincipled.vue'
import MatSurfaceToon from './surface/MatSurfaceToon.vue'
import MatSurfaceGlossy from './surface/MatSurfaceGlossy.vue'

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
	},
	{
		label: 'Glossy BSDF',
		value: 'glossy_bsdf'
	},
	{
		label: 'Toon BSDF',
		value: 'toon_bsdf'
	}
] as const satisfies AcceptableValue[]

type MaterialType = (typeof items)[number]['value']

const matType = ref<MaterialType | undefined>(getInitialType())

watch(matType, (val) => {
	if (!val || !(selectedObject.value instanceof THREE.Mesh)) return
	switch (val) {
		case 'principled_bsdf':
			shadingStore.changeMaterial(selectedObject.value, new THREE.MeshPhysicalMaterial())
			break
		case 'diffuse_bsdf':
			shadingStore.changeMaterial(selectedObject.value, new THREE.MeshLambertMaterial())
			break
		case 'toon_bsdf':
			shadingStore.changeMaterial(selectedObject.value, new THREE.MeshToonMaterial())
			break
		case 'glossy_bsdf':
			shadingStore.changeMaterial(selectedObject.value, new THREE.MeshPhongMaterial())
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
		case 'MeshStandardMaterial':
			value = 'principled_bsdf'
			break
		case 'MeshLambertMaterial':
			value = 'diffuse_bsdf'
			break
		case 'MeshToonMaterial':
			value = 'toon_bsdf'
			break
		case 'MeshPhongMaterial':
			value = 'glossy_bsdf'
			break
	}
	return items.find((item) => item.value === value)?.value
}

function getSurfaceComponent(value: (typeof items)[number]['value']) {
	switch (value) {
		case 'diffuse_bsdf':
			return MatSurfaceDiffuse
		case 'principled_bsdf':
			return MatSurfacePrincipled
		case 'toon_bsdf':
			return MatSurfaceToon
		case 'glossy_bsdf':
			return MatSurfaceGlossy
	}
}
</script>
