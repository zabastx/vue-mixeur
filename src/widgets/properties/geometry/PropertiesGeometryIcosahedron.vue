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
import type { IcosahedronGeometry } from 'three'

const { geometry } = defineProps<{
	geometry: IcosahedronGeometry
}>()

const emits = defineEmits<{
	'update:geometry': [geometry: THREE.IcosahedronGeometry]
}>()

const data = reactive<IcosahedronGeometrySettings>(structuredClone(geometry.parameters))

function onApply() {
	const newGeometry = new THREE.IcosahedronGeometry(data.radius, data.detail)

	emits('update:geometry', newGeometry)
}

const fields: GeometryField<IcosahedronGeometrySettings>[] = [
	{
		key: 'radius',
		label: 'Radius',
		type: 'float',
		min: 0
	},
	{
		key: 'detail',
		label: 'Detail',
		type: 'integer',
		min: 0,
		tooltip: {
			text: `Setting this to a value greater than 0 adds more vertices making it no longer an icosahedron.
			When detail is greater than 1, it's effectively a sphere`
		}
	}
]

type IcosahedronGeometryArgs = ConstructorParameters<typeof THREE.IcosahedronGeometry>

type IcosahedronGeometrySettings = {
	radius: IcosahedronGeometryArgs[0]
	detail: IcosahedronGeometryArgs[1]
}
</script>
