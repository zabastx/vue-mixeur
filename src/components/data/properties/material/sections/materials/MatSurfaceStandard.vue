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

type Mat = THREE.MeshStandardMaterial

const surfaceFields: MaterialInputField<Mat>[] = [
	{
		type: 'color',
		label: 'Base Color',
		prop: 'color'
	},
	{
		type: 'map',
		label: 'Color Map',
		prop: 'map'
	},
	{ type: 'number', label: 'Metalness', prop: 'metalness', min: 0, max: 1, step: 0.01 },
	{ type: 'map', label: 'Metalness Map', prop: 'metalnessMap' },
	{ type: 'number', label: 'Roughness', prop: 'roughness', min: 0, max: 1, step: 0.01 },
	{ type: 'map', label: 'Roughness Map', prop: 'roughnessMap' }
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
		label: 'Alpha',
		value: 'alpha',
		fields: [
			{ type: 'checkbox', label: 'Transparent', prop: 'transparent' },
			{
				type: 'number',
				label: 'Opacity',
				prop: 'opacity',
				min: 0,
				max: 1,
				step: 0.01,
				showIf: 'transparent'
			},
			{
				type: 'map',
				label: 'Alpha Map',
				prop: 'alphaMap'
			},
			{
				type: 'number',
				label: 'Alpha Test',
				prop: 'alphaTest',
				min: 0,
				max: 1,
				step: 0.01
			},
			{
				type: 'checkbox',
				label: 'Alpha to coverage',
				prop: 'alphaToCoverage'
			}
		]
	},
	{
		label: 'Emission',
		value: 'emission',
		fields: [
			{ type: 'color', label: 'Color', prop: 'emissive' },
			{ type: 'map', label: 'Map', prop: 'emissiveMap' },
			{
				type: 'number',
				label: 'Intensity',
				prop: 'emissiveIntensity'
			}
		]
	},
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
	},
	{
		label: 'Light',
		value: 'light',
		fields: [
			{ type: 'map', label: 'Map', prop: 'lightMap' },
			{
				type: 'number',
				label: 'Intensity',
				prop: 'lightMapIntensity',
				min: 0,
				max: 1,
				step: 0.01
			}
		]
	},
	{
		label: 'Ambient Occlusion',
		value: 'ao',
		fields: [
			{ type: 'map', label: 'Map', prop: 'aoMap' },
			{
				type: 'number',
				label: 'Intensity',
				prop: 'aoMapIntensity',
				min: 0,
				max: 1,
				step: 0.01,
				showIf: 'aoMap'
			}
		]
	}
]
</script>
