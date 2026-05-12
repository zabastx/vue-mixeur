<template>
	<div class="pl-1 pt-1 pr-3">
		<InputField label="Surface" class="ml-auto w-fit mb-4">
			<InputSelect
				:model-value="material?.type"
				:items="MATERIAL_SURFACES"
				class="w-[150px]"
				@update:model-value="onUpdateMaterialType"
			/>
		</InputField>
	</div>
	<component :is="currentComponent" v-if="currentComponent" />
</template>

<script lang="ts" setup>
import THREE from '@/shared/three'
import { computed } from 'vue'
import { useMeshMaterial } from '../material'
import { MATERIAL_SURFACES } from './materials/surfaces'

const { material, mesh, changeMaterial } = useMeshMaterial()

function onUpdateMaterialType(val: string | undefined) {
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
		case 'MeshBasicMaterial':
			newMat = new THREE.MeshBasicMaterial()
			break
		default:
			return
	}
	changeMaterial(newMat)
}

const currentComponent = computed(() => {
	return MATERIAL_SURFACES.find((item) => item.value === material.value?.type)?.component
})
</script>
