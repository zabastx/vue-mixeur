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
		prop: 'displacementScale'
	},
	{
		type: 'number',
		label: 'Bias',
		prop: 'displacementBias'
	}
]
</script>
