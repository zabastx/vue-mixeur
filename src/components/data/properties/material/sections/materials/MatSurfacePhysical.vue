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

type Mat = THREE.MeshPhysicalMaterial

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
	{ type: 'map', label: 'Roughness Map', prop: 'roughnessMap' },
	{ type: 'number', label: 'IOR', prop: 'ior', min: 1, max: 2.333, step: 0.01 }
]

const fieldGroups: {
	label: string
	value: string
	fields: MaterialInputField<Mat>[]
}[] = [
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
		label: 'Environment',
		value: 'environment',
		fields: [
			{
				type: 'envMap',
				label: 'Map',
				prop: 'envMap'
			},
			{
				type: 'number',
				label: 'Map Intensity',
				prop: 'envMapIntensity',
				min: 0,
				max: 1,
				step: 0.01
			},
			{
				type: 'euler',
				label: 'Map Rotation',
				prop: 'envMapRotation'
			}
		]
	},
	{
		label: 'Specular',
		value: 'specular',
		fields: [
			{ type: 'color', label: 'Color', prop: 'specularColor' },
			{ type: 'map', label: 'Color Map', prop: 'specularColorMap' },
			{ type: 'number', label: 'Intensity', prop: 'specularIntensity', min: 0, max: 1, step: 0.01 },
			{ type: 'map', label: 'Intensity Map', prop: 'specularIntensityMap' }
		]
	},
	{
		label: 'Anisotropy',
		value: 'anisotropy',
		fields: [
			{ type: 'number', label: 'Strength', prop: 'anisotropy', min: 0, max: 1, step: 0.01 },
			{ type: 'map', label: 'Anisotropy Map', prop: 'anisotropyMap', showIf: 'anisotropy' },
			{
				type: 'angle',
				label: 'Rotation',
				prop: 'anisotropyRotation',
				showIf: 'anisotropy'
			}
		]
	},
	{
		label: 'Sheen',
		value: 'sheen',
		fields: [
			{ type: 'number', label: 'Intensity', prop: 'sheen', min: 0, max: 1, step: 0.01 },
			{ type: 'color', label: 'Color', prop: 'sheenColor' },
			{ type: 'map', label: 'Color Map', prop: 'sheenColorMap' },
			{
				type: 'number',
				label: 'Roughness',
				prop: 'sheenRoughness',
				min: 0,
				max: 1,
				step: 0.01
			},
			{ type: 'map', label: 'Roughness Map', prop: 'sheenRoughnessMap' }
		]
	},
	{
		label: 'Coat',
		value: 'coat',
		fields: [
			{ type: 'number', label: 'Intensity', prop: 'clearcoat', min: 0, max: 1, step: 0.01 },
			{ type: 'map', label: 'Coat Map', prop: 'clearcoatMap', showIf: 'clearcoat' },
			{ type: 'map', label: 'Coat Normal Map', prop: 'clearcoatNormalMap', showIf: 'clearcoat' },
			{
				type: 'number',
				label: 'Roughness',
				prop: 'clearcoatRoughness',
				min: 0,
				max: 1,
				step: 0.01,
				showIf: 'clearcoat'
			},
			{
				type: 'map',
				label: 'Roughness Map',
				prop: 'clearcoatRoughnessMap',
				showIf: 'clearcoat'
			}
			// { type: 'vector2', label: 'Coat Normal Scale', prop: 'clearcoatNormalScale', showIf: 'clearcoat' },
		]
	},
	{
		label: 'Iridescence',
		value: 'iridescence',
		fields: [
			{ type: 'number', label: 'Intensity', prop: 'iridescence', min: 0, max: 1, step: 0.01 },
			{ type: 'map', label: 'Map', prop: 'iridescenceMap', showIf: 'iridescence' },
			{
				type: 'number',
				label: 'IOR',
				prop: 'iridescenceIOR',
				min: 1,
				max: 2.333,
				step: 0.01
			}
			// {
			// 	type: 'map',
			// 	label: 'Thickness Map',
			// 	prop: 'iridescenceThicknessMap'
			// }
			// {
			// 	type: 'range',
			// 	label: 'Thickness Range',
			// 	prop: 'iridescenceThicknessRange',
			// 	min: 0,
			// 	max: 1000,
			// 	step: 1
			// }
		]
	},
	{
		label: 'Transmission',
		value: 'transmission',
		fields: [
			{ type: 'number', label: 'Transmission', prop: 'transmission', min: 0, max: 1, step: 0.01 },
			{ type: 'map', label: 'Map', prop: 'transmissionMap' }
			// {
			// 	type: 'number',
			// 	label: 'Thickness',
			// 	prop: 'thickness',
			// 	min: 0
			// },
			// { type: 'map', label: 'Thickness Map', prop: 'thicknessMap' }
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
