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
import type { SphereGeometry } from 'three'

const { geometry } = defineProps<{
	geometry: SphereGeometry
}>()

const emits = defineEmits<{
	'update:geometry': [geometry: THREE.SphereGeometry]
}>()

const data = reactive<SphereGeometrySettings>({
	radius: geometry.parameters.radius,
	widthSegments: geometry.parameters.widthSegments,
	heightSegments: geometry.parameters.heightSegments,
	phiStart: MathUtils.radToDeg(geometry.parameters.phiStart ?? 0),
	phiLength: MathUtils.radToDeg(geometry.parameters.phiLength ?? Math.PI * 2),
	thetaStart: MathUtils.radToDeg(geometry.parameters.thetaStart ?? 0),
	thetaLength: MathUtils.radToDeg(geometry.parameters.thetaLength ?? Math.PI)
})

function onApply() {
	const newGeometry = new THREE.SphereGeometry(
		data.radius,
		data.widthSegments,
		data.heightSegments,
		data.phiStart ? MathUtils.degToRad(data.phiStart) : undefined,
		data.phiLength ? MathUtils.degToRad(data.phiLength) : undefined,
		data.thetaStart ? MathUtils.degToRad(data.thetaStart) : undefined,
		data.thetaLength ? MathUtils.degToRad(data.thetaLength) : undefined
	)

	emits('update:geometry', newGeometry)
}

const fields: GeometryField<SphereGeometrySettings>[] = [
	{
		key: 'radius',
		label: 'Radius',
		type: 'float',
		min: 0
	},
	{
		key: 'widthSegments',
		label: 'Width Segments',
		type: 'integer',
		min: 3,
		tooltip: {
			text: `Number of horizontal segments`
		}
	},
	{
		key: 'heightSegments',
		label: 'Height Segments',
		type: 'integer',
		min: 2,
		tooltip: {
			text: `Number of vertical segments`
		}
	},
	{
		key: 'phiStart',
		label: 'Phi Start',
		type: 'angle',
		min: 0,
		tooltip: {
			text: `Specify horizontal starting angle`
		}
	},
	{
		key: 'phiLength',
		label: 'Phi Length',
		type: 'angle',
		min: 0,
		tooltip: {
			text: `Specify horizontal sweep angle size`
		}
	},
	{
		key: 'thetaStart',
		label: 'Theta Start',
		type: 'angle',
		min: 0,
		tooltip: {
			text: `Specify horizontal starting angle`
		}
	},
	{
		key: 'thetaLength',
		label: 'Theta Length',
		type: 'angle',
		min: 0,
		tooltip: {
			text: `Specify horizontal sweep angle size`
		}
	}
]

type SphereGeometryArgs = ConstructorParameters<typeof THREE.SphereGeometry>

type SphereGeometrySettings = {
	radius: SphereGeometryArgs[0]
	widthSegments: SphereGeometryArgs[1]
	heightSegments: SphereGeometryArgs[2]
	phiStart: SphereGeometryArgs[3]
	phiLength: SphereGeometryArgs[4]
	thetaStart: SphereGeometryArgs[5]
	thetaLength: SphereGeometryArgs[6]
}
</script>
