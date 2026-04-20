<template>
	<div class="flex flex-col gap-0.5 p-1 items-end">
		<GeometryInputFields v-model="data" :fields="fields" />
		<button type="button" class="btn text-sm px-2" @click="onApply">Apply</button>
	</div>
</template>

<script lang="ts" setup>
import THREE from '@/three'
import { computed, reactive } from 'vue'
import type { GeometryField } from './utils/types'
import { MathUtils } from 'three'

const { mesh } = defineProps<{
	mesh: THREE.Mesh
}>()

const emits = defineEmits<{
	'update:geometry': [geometry: THREE.TorusGeometry]
}>()

const geometryParameters = computed(() => {
	if (mesh.geometry instanceof THREE.TorusGeometry) return mesh.geometry.parameters
	return null
})

const data = reactive<TorusGeometrySettings>({
	radius: geometryParameters.value?.radius,
	tube: geometryParameters.value?.tube,
	radialSegments: geometryParameters.value?.radialSegments,
	tubularSegments: geometryParameters.value?.tubularSegments,
	arc: MathUtils.radToDeg(geometryParameters.value?.arc ?? Math.PI * 2),
	thetaStart: MathUtils.radToDeg(geometryParameters.value?.thetaStart ?? 0),
	thetaLength: MathUtils.radToDeg(geometryParameters.value?.thetaLength ?? Math.PI * 2)
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

/**
 * @param radius Radius of the torus, from the center of the torus to the center of the tube. Default `1`.
 * @param tube Radius of the tube. Must be smaller than `radius`. Default is `0.4`.
 * @param radialSegments Default is `12`.
 * @param tubularSegments Default is `48`.
 * @param arc Central angle. Default is Math.PI * 2.
 * @param {number} [thetaStart=0] - Start of the tubular sweep in radians.
 * @param {number} [thetaLength=Math.PI times 2] - Length of the tubular sweep in radians.
 */

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
