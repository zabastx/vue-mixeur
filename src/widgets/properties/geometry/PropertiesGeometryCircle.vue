<template>
	<div class="flex flex-col gap-0.5 p-1 items-end">
		<GeometryInputFields v-model="data" :fields="fields" />
		<button type="button" class="btn text-sm px-2" @click="onApply">Apply</button>
	</div>
</template>

<script lang="ts" setup>
import THREE from '@/shared/three'
import { MathUtils } from 'three'
import { reactive } from 'vue'
import type { GeometryField } from './utils/types'
import type { CircleGeometry } from 'three'

const { geometry } = defineProps<{
	geometry: CircleGeometry
}>()

const emits = defineEmits<{
	'update:geometry': [geometry: THREE.CircleGeometry]
}>()

const data = reactive<CircleGeometrySettings>({
	radius: geometry.parameters.radius ?? 1,
	segments: geometry.parameters.segments ?? 32,
	thetaStart: MathUtils.radToDeg(geometry.parameters.thetaStart ?? 0),
	thetaLength: MathUtils.radToDeg(geometry.parameters.thetaLength ?? Math.PI * 2)
})

function onApply() {
	const { radius, segments, thetaLength, thetaStart } = data
	const newGeometry = new THREE.CircleGeometry(
		radius,
		segments,
		MathUtils.degToRad(thetaStart ?? 0),
		thetaLength ? MathUtils.degToRad(thetaLength) : Math.PI * 2
	)

	emits('update:geometry', newGeometry)
}

const fields: GeometryField<CircleGeometrySettings>[] = [
	{
		key: 'radius',
		label: 'Radius',
		type: 'float',
		min: 0
	},
	{
		key: 'segments',
		label: 'Segments',
		type: 'integer',
		min: 3
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

type CircleGeometryArgs = ConstructorParameters<typeof THREE.CircleGeometry>

type CircleGeometrySettings = {
	radius: CircleGeometryArgs[0]
	segments: CircleGeometryArgs[1]
	thetaStart: CircleGeometryArgs[2]
	thetaLength: CircleGeometryArgs[3]
}
</script>
