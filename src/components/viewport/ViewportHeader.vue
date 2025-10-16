<template>
	<div class="flex items-center p-1">
		<MenuBar :items="menuItems" />
		<ViewportShadingControls class="ml-auto" />
	</div>
</template>

<script lang="ts" setup>
import { useThreeStore } from '@/store/three'
import MenuBar, { type IMenubarMenu } from '../utils/MenuBar.vue'
import { createMesh } from '@/three/utils/mesh'
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
			}
		]
	}
]

const threeStore = useThreeStore()

function addMesh(type: Parameters<typeof createMesh>[0]) {
	const mesh = createMesh(type)
	threeStore.addObjectToScene(mesh)
}
</script>

<style scoped>
@reference 'tailwindcss/theme';

.menubar-group {
	@apply cursor-pointer rounded px-1 py-0.5 hover:bg-[#303030B3];
	&[data-state='open'] {
		@apply rounded-b-none bg-[#303030B3] brightness-125;
	}
}

.menubar-item {
	@apply flex min-w-32 cursor-pointer flex-nowrap items-center gap-1 rounded bg-(--color-ui-menu-bg-inner) px-1 py-0.5 hover:bg-[#3D3D3DFF];
}
</style>
