<template>
	<div class="flex items-center p-1">
		<MenuBar :items="menuItems" />
		<ViewportShadingControls class="ml-auto" />
	</div>
</template>

<script lang="ts" setup>
import { useThreeStore } from '@/store/three'
import { createCube } from '@/three/utils/mesh/cube'
import MenuBar, { type IMenubarMenu } from '../utils/MenuBar.vue'
import IconMesh from '../icons/mesh/IconMesh.vue'
import IconMeshCube from '../icons/mesh/IconMeshCube.vue'

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
						key: 'mesh_cube',
						label: 'Cube',
						icon: IconMeshCube,
						onClick: addCube
					}
				]
			}
		]
	}
]

const threeStore = useThreeStore()

function addCube() {
	const cube = createCube()
	threeStore.addObjectToScene(cube)
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
