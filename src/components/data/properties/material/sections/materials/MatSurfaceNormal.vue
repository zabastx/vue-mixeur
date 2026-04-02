<template>
	<div class="pl-1 py-1 pr-3 flex flex-col items-end gap-1">
		<MaterialInputFields :fields-list="surfaceFields" />
	</div>
	<MxAccordionRoot collapsible type="multiple">
		<MxAccordionItem
			v-for="group in fieldGroups"
			:key="group.value"
			:label="group.label"
			:item="{ value: group.value }"
			nested
		>
			<div class="pl-1 py-1 pr-3 flex flex-col items-end gap-1">
				<MaterialInputFields :fields-list="group.fields" />
			</div>
		</MxAccordionItem>
	</MxAccordionRoot>
</template>

<script lang="ts" setup>
import THREE from '@/three'
import type { MaterialInputField } from '../../utils/types'

type Mat = THREE.MeshNormalMaterial

const surfaceFields: MaterialInputField<Mat>[] = [
	{ type: 'checkbox', label: 'Transparent', prop: 'transparent' },
	{
		type: 'number',
		label: 'Opacity',
		prop: 'opacity',
		min: 0,
		max: 1,
		step: 0.01,
		showIf: 'transparent'
	}
]

const fieldGroups: {
	label: string
	value: string
	fields: MaterialInputField<Mat>[]
}[] = [
	// {
	// 	label: 'Environment',
	// 	value: 'environment',
	// 	fields: [
	// 		{
	// 			type: 'map',
	// 			label: 'Map',
	// 			prop: 'envMap'
	// 		},
	// 		{
	// 			type: 'number',
	// 			label: 'Map Intensity',
	// 			prop: 'envMapIntensity'
	// 		},
	// 		{
	// 			type: 'angle',
	// 			label: 'Map Rotation',
	// 			prop: 'envMapRotation'
	// 		}
	// 	]
	// },
	{
		label: 'Normal & Bump',
		value: 'normal',
		fields: [
			{ type: 'map', label: 'Normal Map', prop: 'normalMap' },
			{
				type: 'select',
				label: 'Normal Map Type',
				prop: 'normalMapType',
				options: [
					{
						label: 'Tangent Space',
						value: THREE.TangentSpaceNormalMap
					},
					{ label: 'Object Space', value: THREE.ObjectSpaceNormalMap }
				]
			},
			// { type: 'vector2', label: 'Normal Scale', prop: 'normalScale' },
			{ type: 'map', label: 'Bump Map', prop: 'bumpMap' },
			{
				type: 'number',
				label: 'Bump Scale',
				prop: 'bumpScale',
				min: 0,
				max: 1,
				step: 0.01
			}
		]
	}
]
</script>
