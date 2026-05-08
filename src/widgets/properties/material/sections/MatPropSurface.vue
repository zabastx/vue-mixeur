<template>
	<div class="pl-1 pt-1 pr-3">
		<InputField label="Surface" class="ml-auto w-fit mb-4">
			<InputSelect v-model="matType" :items="MATERIAL_SURFACES" class="w-[150px]" />
		</InputField>
	</div>
	<component :is="currentComponent" v-if="matType" />
</template>

<script lang="ts" setup>
import THREE from '@/shared/three'
import { computed, ref, watch } from 'vue'
import { useMeshMaterial } from '../material'
import { MATERIAL_SURFACES } from './materials/surfaces'

const { material, mesh, changeMaterial } = useMeshMaterial()

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
		case 'MeshBasiclMaterial':
			newMat = new THREE.MeshBasicMaterial()
			break
		default:
			return
	}
	changeMaterial(newMat)
})

const currentComponent = computed(() => {
	return MATERIAL_SURFACES.find((item) => item.value === matType.value)?.component
})
</script>
