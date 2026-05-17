<template>
	<div class="flex flex-col gap-0.5 p-1 items-end">
		<GeometryInputFields v-model="data" :fields="fields" />
		<button type="button" class="btn text-sm px-2" @click="onApply">Apply</button>
	</div>
</template>

<script lang="ts" setup generic="T">
import THREE from '@/shared/three'
import { reactive } from 'vue'
import type { GeometryField } from './utils/types'
import type { BoxGeometry } from 'three'

const { geometry } = defineProps<{
	geometry: BoxGeometry
}>()

const emits = defineEmits<{
	'update:geometry': [geometry: THREE.BoxGeometry]
}>()

const data = reactive<BoxGeometrySettings>({
	width: geometry.parameters.width ?? 1,
	height: geometry.parameters.height ?? 1,
	depth: geometry.parameters.depth ?? 1,
	depthSegments: geometry.parameters.depthSegments ?? 1,
	heightSegments: geometry.parameters.heightSegments ?? 1,
	widthSegments: geometry.parameters.widthSegments ?? 1
})

function onApply() {
	const newGeometry = new THREE.BoxGeometry(
		data.width,
		data.height,
		data.depth,
		data.widthSegments,
		data.heightSegments,
		data.depthSegments
	)

	emits('update:geometry', newGeometry)
}

const fields: GeometryField<BoxGeometrySettings>[] = [
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
		key: 'depth',
		label: 'Depth',
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
	},
	{
		key: 'depthSegments',
		label: 'Depth Segments',
		type: 'integer',
		min: 1,
		tooltip: {
			text: 'Number of segmented rectangular faces along the depth of the sides'
		}
	}
]

type BoxGeometryArgs = ConstructorParameters<typeof THREE.BoxGeometry>

type BoxGeometrySettings = {
	width: BoxGeometryArgs[0]
	height: BoxGeometryArgs[1]
	depth: BoxGeometryArgs[2]
	widthSegments: BoxGeometryArgs[3]
	heightSegments: BoxGeometryArgs[4]
	depthSegments: BoxGeometryArgs[5]
}
</script>
