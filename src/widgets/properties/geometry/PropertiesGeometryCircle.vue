<template>
	<div class="flex flex-col gap-0.5 p-1 items-end">
		<GeometryInputFields v-model="data" :fields="fields" />
		<button type="button" class="btn text-sm px-2" @click="onApply">Apply</button>
	</div>
</template>

<script lang="ts" setup>
import THREE from '@/shared/three'
import { MathUtils } from 'three'
import { computed, ref } from 'vue'
import type { GeometryField } from './utils/types'

const { mesh } = defineProps<{
	mesh: THREE.Mesh
}>()

const emits = defineEmits<{
	'update:geometry': [geometry: THREE.CircleGeometry]
}>()

const geometryParameters = computed(() => {
	if (mesh.geometry instanceof THREE.CircleGeometry) return mesh.geometry.parameters
	return null
})

const data = ref<CircleGeometrySettings>({
	radius: geometryParameters.value?.radius ?? 1,
	segments: geometryParameters.value?.segments ?? 32,
	thetaStart: MathUtils.radToDeg(geometryParameters.value?.thetaStart ?? 0),
	thetaLength: MathUtils.radToDeg(geometryParameters.value?.thetaLength ?? Math.PI * 2)
})

function onApply() {
	const { radius, segments, thetaLength, thetaStart } = data.value
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
