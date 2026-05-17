<template>
	<MaterialInputFields :fields-list="fields" />
</template>

<script lang="ts" setup>
import type THREE from '@/shared/three'
import type { MaterialInputField, MeshMaterials } from '../utils/types'

const fields: MaterialInputField<Exclude<MeshMaterials, THREE.MeshBasicMaterial>>[] = [
	{ type: 'map', label: 'Map', prop: 'displacementMap' },
	{
		type: 'number',
		label: 'Scale',
		prop: 'displacementScale',
		step: 0.01
	},
	{
		type: 'number',
		label: 'Bias',
		prop: 'displacementBias',
		step: 0.01
	}
]
</script>
