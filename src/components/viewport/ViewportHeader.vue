<template>
	<div class="p-0.5 flex items-center">
		<MenubarRoot class="relative z-10 text-xs">
			<MenubarMenu>
				<MenubarTrigger class="menubar-group"> Add </MenubarTrigger>
				<MenubarContent class="bg-[#181818FF] p-1">
					<MenubarItem class="menubar-item" @click="addCube">
						<span class="min-w-5"></span>Cube</MenubarItem
					>
				</MenubarContent>
			</MenubarMenu>
		</MenubarRoot>
		<ViewportShadingControls class="ml-auto" />
	</div>
</template>

<script lang="ts" setup>
import { useThreeStore } from '@/store/three'
import { createCube } from '@/three/utils/mesh/cube'

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
}

.menubar-item {
	@apply cursor-pointer rounded px-1 py-0.5 bg-[#181818FF] hover:bg-[#3D3D3DFF] flex flex-nowrap items-center min-w-32 gap-1;
}
</style>
