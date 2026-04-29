<template>
	<div class="pl-1 pt-1 pr-3">
		<InputField label="Surface" class="ml-auto w-fit mb-4">
			<InputSelect v-model="matType" :items="SURFACES" class="w-[150px]" />
		</InputField>
	</div>
	<component :is="currentComponent" v-if="matType" />
</template>

<script lang="ts" setup>
import THREE from '@/shared/three'
import { computed, ref, watch } from 'vue'
import { useMeshMaterial } from '../material'
import MatSurfacePhysical from './materials/MatSurfacePhysical.vue'
import MatSurfaceStandard from './materials/MatSurfaceStandard.vue'
import MatSurfacePhong from './materials/MatSurfacePhong.vue'
import MatSurfaceToon from './materials/MatSurfaceToon.vue'
import MatSurfaceLambert from './materials/MatSurfaceLambert.vue'
import MatSurfaceNormal from './materials/MatSurfaceNormal.vue'

const { material, mesh, changeMaterial } = useMeshMaterial()

const SURFACES = [
	{
		label: 'Standard Material',
		value: 'MeshStandardMaterial',
		component: MatSurfaceStandard,
		tooltip: {
			text: 'A standard physically based material, using Metallic-Roughness workflow'
		}
	},
	{
		label: 'Physical Material',
		value: 'MeshPhysicalMaterial',
		component: MatSurfacePhysical,
		tooltip: {
			text: `An extension of the Standard Material, providing more advanced physically-based rendering properties`
		}
	},
	{
		label: 'Phong Material',
		value: 'MeshPhongMaterial',
		component: MatSurfacePhong,
		tooltip: {
			text: 'A material for shiny surfaces with specular highlights'
		}
	},
	{
		label: 'Toon Material',
		value: 'MeshToonMaterial',
		component: MatSurfaceToon,
		tooltip: {
			text: 'A material implementing toon shading'
		}
	},
	{
		label: 'Lambert Material',
		value: 'MeshLambertMaterial',
		component: MatSurfaceLambert,
		tooltip: {
			text: 'A material for non-shiny surfaces, without specular highlights'
		}
	},
	{
		label: 'Normal Material',
		value: 'MeshNormalMaterial',
		component: MatSurfaceNormal,
		tooltip: {
			text: 'A material that maps the normal vectors to RGB colors'
		}
	}
] as const

const matType = ref<string | undefined>(material.value?.type)

watch(matType, (val) => {
	if (!val || !(mesh.value instanceof THREE.Mesh)) return
	let newMat: THREE.Material | undefined
	switch (val) {
		case 'MeshPhysicalMaterial':
			newMat = new THREE.MeshPhysicalMaterial()
			break
		case 'MeshStandardMaterial':
			newMat = new THREE.MeshStandardMaterial()
			break
		case 'MeshPhongMaterial':
			newMat = new THREE.MeshPhongMaterial()
			break
		case 'MeshToonMaterial':
			newMat = new THREE.MeshToonMaterial()
			break
		case 'MeshLambertMaterial':
			newMat = new THREE.MeshLambertMaterial()
			break
		case 'MeshNormalMaterial':
			newMat = new THREE.MeshNormalMaterial()
			break
		default:
			return
	}
	changeMaterial(newMat)
})

const currentComponent = computed(() => {
	return SURFACES.find((item) => item.value === matType.value)?.component
})
</script>
