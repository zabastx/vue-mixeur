<template>
	<div class="flex flex-col gap-0.5 p-1 items-end">
		<GeometryInputFields v-model="data" :fields="fields" />
		<button type="button" class="btn text-sm px-2" @click="onApply">Apply</button>
	</div>
</template>

<script lang="ts" setup>
import THREE from '@/three'
import { computed, ref } from 'vue'
import type { GeometryField } from './utils/types'

const { mesh } = defineProps<{
	mesh: THREE.Mesh
}>()

const emits = defineEmits<{
	'update:geometry': [geometry: THREE.BoxGeometry]
}>()

const geometryParameters = computed(() => {
	if (mesh.geometry instanceof THREE.BoxGeometry) return mesh.geometry.parameters
	return null
})

const data = ref<BoxGeometrySettings>({
	width: geometryParameters.value?.width ?? 1,
	height: geometryParameters.value?.height ?? 1,
	depth: geometryParameters.value?.depth ?? 1,
	depthSegments: geometryParameters.value?.depthSegments ?? 1,
	heightSegments: geometryParameters.value?.heightSegments ?? 1,
	widthSegments: geometryParameters.value?.widthSegments ?? 1
})

function onApply() {
	const newGeometry = new THREE.BoxGeometry(
		data.value.width,
		data.value.height,
		data.value.depth,
		data.value.widthSegments,
		data.value.heightSegments,
		data.value.depthSegments
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
