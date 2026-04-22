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
	'update:geometry': [geometry: THREE.PlaneGeometry]
}>()

const geometryParameters = computed(() => {
	if (mesh.geometry instanceof THREE.PlaneGeometry) return mesh.geometry.parameters
	return null
})

const data = ref<PlaneGeometrySettings>({
	width: geometryParameters.value?.width ?? 1,
	height: geometryParameters.value?.height ?? 1,
	widthSegments: geometryParameters.value?.widthSegments ?? 1,
	heightSegments: geometryParameters.value?.heightSegments ?? 1
})

function onApply() {
	const newGeometry = new THREE.PlaneGeometry(
		data.value.width,
		data.value.height,
		data.value.widthSegments,
		data.value.heightSegments
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
