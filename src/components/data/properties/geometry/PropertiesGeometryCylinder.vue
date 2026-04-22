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
import { MathUtils } from 'three'

const { mesh } = defineProps<{
	mesh: THREE.Mesh
}>()

const emits = defineEmits<{
	'update:geometry': [geometry: THREE.CylinderGeometry]
}>()

const geometryParameters = computed(() => {
	if (mesh.geometry instanceof THREE.CylinderGeometry) return mesh.geometry.parameters
	return null
})

const data = ref<CylinderGeometrySettings>({
	radiusTop: geometryParameters.value?.radiusTop ?? 1,
	radiusBottom: geometryParameters.value?.radiusBottom ?? 1,
	height: geometryParameters.value?.height ?? 1,
	radialSegments: geometryParameters.value?.radialSegments ?? 1,
	heightSegments: geometryParameters.value?.heightSegments ?? 1,
	openEnded: geometryParameters.value?.openEnded ?? false,
	thetaStart: MathUtils.radToDeg(geometryParameters.value?.thetaStart ?? 0),
	thetaLength: MathUtils.radToDeg(geometryParameters.value?.thetaLength ?? Math.PI * 2)
})

function onApply() {
	const newGeometry = new THREE.CylinderGeometry(
		data.value.radiusTop,
		data.value.radiusBottom,
		data.value.height,
		data.value.radialSegments,
		data.value.heightSegments,
		data.value.openEnded,
		data.value.thetaStart ? MathUtils.degToRad(data.value.thetaStart) : 0,
		data.value.thetaLength ? MathUtils.degToRad(data.value.thetaLength) : Math.PI * 2
	)

	emits('update:geometry', newGeometry)
}

const fields: GeometryField<CylinderGeometrySettings>[] = [
	{
		key: 'radiusTop',
		label: 'Radius Top',
		type: 'float',
		min: 0
	},
	{
		key: 'radiusBottom',
		label: 'Radius Bottom',
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
		key: 'radialSegments',
		label: 'Radial Segments',
		type: 'integer',
		min: 1,
		tooltip: {
			text: 'Number of segmented faces around the circumference of the cylinder'
		}
	},
	{
		key: 'heightSegments',
		label: 'Height Segments',
		type: 'integer',
		min: 1,
		tooltip: {
			text: 'Number of rows of faces along the height of the cylinder'
		}
	},
	{
		key: 'openEnded',
		label: 'Open Ended',
		type: 'boolean',
		tooltip: {
			text: 'Whether the ends of the cylinder are open or capped'
		}
	},
	{
		key: 'thetaStart',
		label: 'Theta Start',
		type: 'angle',
		min: 0,
		tooltip: {
			text: 'Start angle for first segment'
		}
	},
	{
		key: 'thetaLength',
		label: 'Theta Length',
		type: 'angle',
		min: 0,
		tooltip: {
			text: 'The central angle, often called theta, of the circular sector'
		}
	}
]

type CylinderGeometryArgs = ConstructorParameters<typeof THREE.CylinderGeometry>

type CylinderGeometrySettings = {
	radiusTop: CylinderGeometryArgs[0]
	radiusBottom: CylinderGeometryArgs[1]
	height: CylinderGeometryArgs[2]
	radialSegments: CylinderGeometryArgs[3]
	heightSegments: CylinderGeometryArgs[4]
	openEnded: CylinderGeometryArgs[5]
	thetaStart: CylinderGeometryArgs[6]
	thetaLength: CylinderGeometryArgs[7]
}
</script>
