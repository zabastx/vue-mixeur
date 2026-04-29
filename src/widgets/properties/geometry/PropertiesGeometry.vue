<template>
	<MxAccordionRoot type="multiple" :default-value="['geometry']">
		<MxAccordionItem label="Geometry" :item="{ value: 'geometry' }">
			<component :is="geometryComponent" :mesh="object" @update:geometry="onUpdateGeometry" />
		</MxAccordionItem>
	</MxAccordionRoot>
</template>

<script lang="ts" setup>
import { useThreeStore } from '@/app/model/three'
import THREE from '@/shared/three'
import { computed } from 'vue'
import PropertiesGeometryBox from './PropertiesGeometryBox.vue'
import PropertiesGeometryPlane from './PropertiesGeometryPlane.vue'
import PropertiesGeometryCircle from './PropertiesGeometryCircle.vue'
import PropertiesGeometrySphere from './PropertiesGeometrySphere.vue'
import PropertiesGeometryIcosahedron from './PropertiesGeometryIcosahedron.vue'
import PropertiesGeometryCylinder from './PropertiesGeometryCylinder.vue'
import PropertiesGeometryCone from './PropertiesGeometryCone.vue'
import PropertiesGeometryTorus from './PropertiesGeometryTorus.vue'
import { enableBVH } from '@/shared/three/utils'

const threeStore = useThreeStore()

const object = computed(() => threeStore.selectedObject as THREE.Mesh)

const geometryComponent = computed(() => {
	if (!object.value) return null

	switch (object.value.geometry.type) {
		case 'BoxGeometry':
			return PropertiesGeometryBox
		case 'PlaneGeometry':
			return PropertiesGeometryPlane
		case 'CircleGeometry':
			return PropertiesGeometryCircle
		case 'SphereGeometry':
			return PropertiesGeometrySphere
		case 'IcosahedronGeometry':
			return PropertiesGeometryIcosahedron
		case 'CylinderGeometry':
			return PropertiesGeometryCylinder
		case 'ConeGeometry':
			return PropertiesGeometryCone
		case 'TorusGeometry':
			return PropertiesGeometryTorus

		default:
			return null
	}
})

function onUpdateGeometry(newGeometry: THREE.BufferGeometry) {
	if (!object.value) return
	const oldGeometry = object.value.geometry as THREE.BufferGeometry
	object.value.geometry = newGeometry
	enableBVH(object.value)
	oldGeometry.dispose()
}
</script>
