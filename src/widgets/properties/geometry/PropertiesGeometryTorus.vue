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
import { MathUtils } from 'three'
import type { TorusGeometry } from 'three'

const { geometry } = defineProps<{
	geometry: TorusGeometry
}>()

const emits = defineEmits<{
	'update:geometry': [geometry: THREE.TorusGeometry]
}>()

const data = reactive<TorusGeometrySettings>({
	radius: geometry.parameters.radius,
	tube: geometry.parameters.tube,
	radialSegments: geometry.parameters.radialSegments,
	tubularSegments: geometry.parameters.tubularSegments,
	arc: MathUtils.radToDeg(geometry.parameters.arc ?? Math.PI * 2),
	thetaStart: MathUtils.radToDeg(geometry.parameters.thetaStart ?? 0),
	thetaLength: MathUtils.radToDeg(geometry.parameters.thetaLength ?? Math.PI * 2)
})

function onApply() {
	const newGeometry = new THREE.TorusGeometry(
		data.radius,
		data.tube,
		data.radialSegments,
		data.tubularSegments,
		data.arc ? MathUtils.degToRad(data.arc) : undefined,
		data.thetaStart ? MathUtils.degToRad(data.thetaStart) : undefined,
		data.thetaLength ? MathUtils.degToRad(data.thetaLength) : undefined
	)

	emits('update:geometry', newGeometry)
}

const fields: GeometryField<TorusGeometrySettings>[] = [
	{
		key: 'radius',
		label: 'Torus Radius',
		type: 'float',
		min: 0,
		tooltip: {
			text: 'Radius of the torus, from the center of the torus to the center of the tube'
		}
	},
	{
		key: 'tube',
		label: 'Tube Radius',
		type: 'float',
		min: 0,
		tooltip: {
			text: 'Radius of the tube. Must be smaller than `radius`'
		}
	},
	{
		key: 'radialSegments',
		label: 'Radial Segments',
		type: 'integer',
		min: 1,
		tooltip: {
			text: `Number of vertical segments`
		}
	},
	{
		key: 'tubularSegments',
		label: 'Tubular Segments',
		type: 'integer',
		min: 1,
		tooltip: {
			text: `Specify horizontal starting angle`
		}
	},
	{
		key: 'arc',
		label: 'Arc',
		type: 'angle',
		min: 0,
		tooltip: {
			text: `Central angle`
		}
	},
	{
		key: 'thetaStart',
		label: 'Theta Start',
		type: 'angle',
		min: 0,
		tooltip: {
			text: `Start of the tubular sweep`
		}
	},
	{
		key: 'thetaLength',
		label: 'Theta Length',
		type: 'angle',
		min: 0,
		tooltip: {
			text: `Length of the tubular sweep`
		}
	}
]

type TorusGeometryArgs = ConstructorParameters<typeof THREE.TorusGeometry>

type TorusGeometrySettings = {
	radius: TorusGeometryArgs[0]
	tube: TorusGeometryArgs[1]
	radialSegments: TorusGeometryArgs[2]
	tubularSegments: TorusGeometryArgs[3]
	arc: TorusGeometryArgs[4]
	thetaStart: TorusGeometryArgs[5]
	thetaLength: TorusGeometryArgs[6]
}
</script>
