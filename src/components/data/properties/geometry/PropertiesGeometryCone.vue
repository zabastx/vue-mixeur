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
	'update:geometry': [geometry: THREE.ConeGeometry]
}>()

const geometryParameters = computed(() => {
	if (mesh.geometry instanceof THREE.ConeGeometry) return mesh.geometry.parameters
	return null
})

const data = ref<ConeGeometrySettings>({
	radius: geometryParameters.value?.radius ?? 1,
	height: geometryParameters.value?.height ?? 1,
	radialSegments: geometryParameters.value?.radialSegments ?? 32,
	heightSegments: geometryParameters.value?.heightSegments ?? 1,
	openEnded: geometryParameters.value?.openEnded ?? false,
	thetaStart: MathUtils.radToDeg(geometryParameters.value?.thetaStart ?? 0),
	thetaLength: MathUtils.radToDeg(geometryParameters.value?.thetaLength ?? Math.PI * 2)
})

function onApply() {
	const newGeometry = new THREE.ConeGeometry(
		data.value.radius,
		data.value.height,
		data.value.radialSegments,
		data.value.heightSegments,
		data.value.openEnded,
		data.value.thetaStart ? MathUtils.degToRad(data.value.thetaStart) : 0,
		data.value.thetaLength ? MathUtils.degToRad(data.value.thetaLength) : Math.PI * 2
	)

	emits('update:geometry', newGeometry)
}

const fields: GeometryField<ConeGeometrySettings>[] = [
	{
		key: 'radius',
		label: 'Radius',
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
		min: 0,
		tooltip: {
			text: 'Number of segmented faces around the circumference of the cone'
		}
	},
	{
		key: 'heightSegments',
		label: 'Height Segments',
		type: 'integer',
		min: 1,
		tooltip: {
			text: 'Number of segmented rectangular faces along the width of the sides'
		}
	},
	{
		key: 'openEnded',
		label: 'Open Ended',
		type: 'boolean',
		tooltip: {
			text: 'Whether the base of the cone is open (checked) or capped (unchecked)'
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

type ConeGeometryArgs = ConstructorParameters<typeof THREE.ConeGeometry>

type ConeGeometrySettings = {
	radius: ConeGeometryArgs[0]
	height: ConeGeometryArgs[1]
	radialSegments: ConeGeometryArgs[2]
	heightSegments: ConeGeometryArgs[3]
	openEnded: ConeGeometryArgs[4]
	thetaStart: ConeGeometryArgs[5]
	thetaLength: ConeGeometryArgs[6]
}
</script>
