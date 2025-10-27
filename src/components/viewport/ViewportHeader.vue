<template>
	<div class="flex items-center p-1">
		<MenuBar :items="menuItems" />
		<ViewportShadingControls class="ml-auto" />
	</div>
</template>

<script lang="ts" setup>
import { useThreeStore } from '@/store/three'
import MenuBar, { type IMenubarMenu } from '../utils/MenuBar.vue'
import { createMesh } from '@/three/modules/mesh'
import {
	IconMeshPlane,
	IconMesh,
	IconMeshCircle,
	IconMeshCone,
	IconMeshCube,
	IconMeshCylinder,
	IconMeshIcosphere,
	IconMeshSphere,
	IconMeshTorus
} from '../icons/mesh'
import { createLight } from '@/three/modules/light'
import {
	IconLight,
	IconLightArea,
	IconLightPoint,
	IconLightSpot,
	IconLightSun
} from '../icons/light'
import IconText from '../icons/misc/IconText.vue'
import { createText } from '@/three/modules/text'

const menuItems: IMenubarMenu[] = [
	{
		label: 'Add',
		items: [
			{
				type: 'sub',
				key: 'mesh',
				label: 'Mesh',
				icon: IconMesh,
				items: [
					{
						type: 'item',
						key: 'mesh_plane',
						label: 'Plane',
						icon: IconMeshPlane,
						onClick() {
							addMesh('plane')
						}
					},
					{
						type: 'item',
						key: 'mesh_cube',
						label: 'Cube',
						icon: IconMeshCube,
						onClick() {
							addMesh('cube')
						}
					},
					{
						type: 'item',
						key: 'mesh_circle',
						label: 'Circle',
						icon: IconMeshCircle,
						onClick() {
							addMesh('circle')
						}
					},
					{
						type: 'item',
						key: 'mesh_sphere',
						label: 'UV Sphere',
						icon: IconMeshSphere,
						onClick() {
							addMesh('sphere')
						}
					},
					{
						type: 'item',
						key: 'mesh_icosphere',
						label: 'Ico Sphere',
						icon: IconMeshIcosphere,
						onClick() {
							addMesh('icosphere')
						}
					},
					{
						type: 'item',
						key: 'mesh_cylinder',
						label: 'Cylinder',
						icon: IconMeshCylinder,
						onClick() {
							addMesh('cylinder')
						}
					},
					{
						type: 'item',
						key: 'mesh_cone',
						label: 'Cone',
						icon: IconMeshCone,
						onClick() {
							addMesh('cone')
						}
					},
					{
						type: 'item',
						key: 'mesh_torus',
						label: 'Torus',
						icon: IconMeshTorus,
						onClick() {
							addMesh('torus')
						}
					}
				]
			},
			{
				type: 'item',
				key: 'text',
				label: 'Text',
				icon: IconText,
				onClick() {
					createText().then((text) => {
						if (text) {
							threeStore.addModelToScene(text)
						}
					})
				}
			},
			{
				type: 'separator',
				key: 'sep1'
			},
			{
				type: 'sub',
				key: 'light',
				label: 'Light',
				icon: IconLight,
				items: [
					{
						type: 'item',
						key: 'light_point',
						label: 'Point',
						icon: IconLightPoint,
						onClick() {
							addLight('PointLight')
						}
					},
					{
						type: 'item',
						key: 'light_spot',
						label: 'Spot',
						icon: IconLightSpot,
						onClick() {
							addLight('SpotLight')
						}
					},
					{
						type: 'item',
						key: 'light_directional',
						label: 'Directional',
						icon: IconLightSun,
						onClick() {
							addLight('DirectionalLight')
						}
					},
					{
						type: 'item',
						key: 'light_area',
						label: 'Area',
						icon: IconLightArea,
						onClick() {
							addLight('RectAreaLight')
						}
					}
				]
			}
		]
	}
]

const threeStore = useThreeStore()

function addMesh(type: Parameters<typeof createMesh>[0]) {
	const mesh = createMesh(type)
	threeStore.addModelToScene(mesh)
}

function addLight(type: Parameters<typeof createLight>['0']['type']) {
	const light = createLight({ type })
	threeStore.addLightHelperToScene(light)
}
</script>
