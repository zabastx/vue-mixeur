<template>
	<div class="flex flex-col gap-0.5 p-1 items-end">
		<GeometryInputFields v-model="data" :fields="fields" />
		<button type="button" class="btn text-sm px-2" @click="onApply">Apply</button>
	</div>
</template>

<script lang="ts" setup>
import THREE from '@/shared/three'
import { reactive } from 'vue'
import type { GeometryField } from './utils/types'
import type { PlaneGeometry } from 'three'

const { geometry } = defineProps<{
	geometry: PlaneGeometry
}>()

const emits = defineEmits<{
	'update:geometry': [geometry: THREE.PlaneGeometry]
}>()

const data = reactive<PlaneGeometrySettings>(structuredClone(geometry.parameters))

function onApply() {
	const newGeometry = new THREE.PlaneGeometry(
		data.width,
		data.height,
		data.widthSegments,
		data.heightSegments
	)

	emits('update:geometry', newGeometry)
}

const fields: GeometryField<PlaneGeometrySettings>[] = [
	{
		key: 'width',
		label: 'Width',
		type: 'float',
		min: 0
	},
	{
		key: 'height',
		label: 'Height',
		type: 'float',
		min: 0
	},
	{
		key: 'widthSegments',
		label: 'Width Segments',
		type: 'integer',
		min: 1,
		tooltip: {
			text: 'Number of segmented rectangular faces along the width of the sides'
		}
	},
	{
		key: 'heightSegments',
		label: 'Height Segments',
		type: 'integer',
		min: 1,
		tooltip: {
			text: 'Number of segmented rectangular faces along the height of the sides'
		}
	}
]

type PlaneGeometryArgs = ConstructorParameters<typeof THREE.PlaneGeometry>

type PlaneGeometrySettings = {
	width: PlaneGeometryArgs[0]
	height: PlaneGeometryArgs[1]
	widthSegments: PlaneGeometryArgs[2]
	heightSegments: PlaneGeometryArgs[3]
}
</script>
