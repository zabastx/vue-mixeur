<template>
	<div class="flex flex-col gap-0.5 p-1 items-end">
		<GeometryInputFields v-model="data" :fields="fields" />
		<button type="button" class="btn text-sm px-2" @click="onApply">Apply</button>
	</div>
</template>

<script lang="ts" setup>
import THREE from '@/shared/three'
import { computed, ref } from 'vue'
import type { GeometryField } from './utils/types'
import { MathUtils } from 'three'

const { mesh } = defineProps<{
	mesh: THREE.Mesh
}>()

const emits = defineEmits<{
	'update:geometry': [geometry: THREE.SphereGeometry]
}>()

const geometryParameters = computed(() => {
	if (mesh.geometry instanceof THREE.SphereGeometry) return mesh.geometry.parameters
	return null
})

const data = ref<SphereGeometrySettings>({
	radius: geometryParameters.value?.radius,
	widthSegments: geometryParameters.value?.widthSegments,
	heightSegments: geometryParameters.value?.heightSegments,
	phiStart: MathUtils.radToDeg(geometryParameters.value?.phiStart ?? 0),
	phiLength: MathUtils.radToDeg(geometryParameters.value?.phiLength ?? Math.PI * 2),
	thetaStart: MathUtils.radToDeg(geometryParameters.value?.thetaStart ?? 0),
	thetaLength: MathUtils.radToDeg(geometryParameters.value?.thetaLength ?? Math.PI)
})

function onApply() {
	const newGeometry = new THREE.SphereGeometry(
		data.value.radius,
		data.value.widthSegments,
		data.value.heightSegments,
		data.value.phiStart ? MathUtils.degToRad(data.value.phiStart) : undefined,
		data.value.phiLength ? MathUtils.degToRad(data.value.phiLength) : undefined,
		data.value.thetaStart ? MathUtils.degToRad(data.value.thetaStart) : undefined,
		data.value.thetaLength ? MathUtils.degToRad(data.value.thetaLength) : undefined
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
