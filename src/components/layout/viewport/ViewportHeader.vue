<template>
	<div class="flex items-center p-1 gap-2">
		<MxIcon name="ui/viewport" />
		<MenuBar :items="menuItems" />
		<ViewportShadingControls class="ml-auto" />
		<ViewportToolSettings v-if="showToolSettings" class="absolute top-full left-0 rounded-br" />
	</div>
</template>

<script lang="ts" setup>
import { useThreeStore } from '@/store/three'
import { createMesh } from '@/three/modules/mesh'
import { createLight } from '@/three/modules/light'
import { createText } from '@/three/modules/text'
import { createCamera } from '@/three/modules/camera/create'
import type { IMenubarMenu } from '@/components/base/ui/MenuBar.vue'
import { storeToRefs } from 'pinia'
import { useAppStore } from '@/store/app'

const { showToolSettings, showToolbar } = storeToRefs(useAppStore())

const menuItems: IMenubarMenu[] = [
	{
		label: 'View',
		items: [
			{
				key: 'tool_bar',
				label: 'Toolbar',
				type: 'checkbox',
				model: showToolbar
			},
			{
				key: 'tool_settings',
				label: 'Tool Settings',
				type: 'checkbox',
				model: showToolSettings
			}
		]
	},
	{
		label: 'Add',
		items: [
			{
				type: 'sub',
				key: 'mesh',
				label: 'Mesh',
				icon: 'mesh/mesh',
				items: [
					{
						type: 'item',
						key: 'mesh_plane',
						label: 'Plane',
						icon: 'mesh/mesh-plane',
						onClick() {
							addMesh('plane')
						}
					},
					{
						type: 'item',
						key: 'mesh_cube',
						label: 'Cube',
						icon: 'mesh/mesh-cube',
						onClick() {
							addMesh('cube')
						}
					},
					{
						type: 'item',
						key: 'mesh_circle',
						label: 'Circle',
						icon: 'mesh/mesh-circle',
						onClick() {
							addMesh('circle')
						}
					},
					{
						type: 'item',
						key: 'mesh_sphere',
						label: 'UV Sphere',
						icon: 'mesh/mesh-sphere',
						onClick() {
							addMesh('sphere')
						}
					},
					{
						type: 'item',
						key: 'mesh_icosphere',
						label: 'Ico Sphere',
						icon: 'mesh/mesh-icosphere',
						onClick() {
							addMesh('icosphere')
						}
					},
					{
						type: 'item',
						key: 'mesh_cylinder',
						label: 'Cylinder',
						icon: 'mesh/mesh-cylinder',
						onClick() {
							addMesh('cylinder')
						}
					},
					{
						type: 'item',
						key: 'mesh_cone',
						label: 'Cone',
						icon: 'mesh/mesh-cone',
						onClick() {
							addMesh('cone')
						}
					},
					{
						type: 'item',
						key: 'mesh_torus',
						label: 'Torus',
						icon: 'mesh/mesh-torus',
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
				icon: 'misc/text',
				onClick() {
					createText().then((text) => {
						if (text) {
							threeStore.addObjectToScene(text)
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
				icon: 'light/light',
				items: [
					{
						type: 'item',
						key: 'light_point',
						label: 'Point',
						icon: 'light/light-point',
						onClick() {
							addLight('point')
						}
					},
					{
						type: 'item',
						key: 'light_spot',
						label: 'Spot',
						icon: 'light/light-spot',
						onClick() {
							addLight('spot')
						}
					},
					{
						type: 'item',
						key: 'light_directional',
						label: 'Directional',
						icon: 'light/light-sun',
						onClick() {
							addLight('sun')
						}
					},
					{
						type: 'item',
						key: 'light_area',
						label: 'Area',
						icon: 'light/light-area',
						onClick() {
							addLight('area')
						}
					}
				]
			},
			{
				type: 'separator',
				key: 'sep1'
			},
			{
				type: 'item',
				key: 'camera',
				label: 'Camera',
				icon: 'outliner/camera-obj',
				onClick() {
					const camera = createCamera({
						type: 'Perspective',
						name: 'Camera'
					})

					threeStore.addObjectToScene(camera)
				}
			}
		]
	}
]

const threeStore = useThreeStore()

function addMesh(type: Parameters<typeof createMesh>[0]) {
	const mesh = createMesh(type)
	threeStore.addObjectToScene(mesh)
}

function addLight(type: Parameters<typeof createLight>['0']['type']) {
	const light = createLight({ type })
	threeStore.addObjectToScene(light)
}
</script>
