<template>
	<MaterialInputFields :fields-list="fields" />
</template>

<script lang="ts" setup>
import type { MaterialInputField, MeshMaterials } from '../utils/types'

const fields: MaterialInputField<MeshMaterials>[] = [
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
