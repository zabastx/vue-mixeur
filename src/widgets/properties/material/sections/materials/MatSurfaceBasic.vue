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
import THREE from '@/shared/three'
import type { MaterialInputField } from '../../utils/types'

type Mat = THREE.MeshBasicMaterial

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
	}
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
				type: 'euler',
				label: 'Map Rotation',
				prop: 'envMapRotation'
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
