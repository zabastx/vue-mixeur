<template>
	<div class="p-1 flex items-center">
		<MenubarRoot class="relative text-xs">
			<MenubarMenu>
				<MenubarTrigger class="menubar-group"> Add </MenubarTrigger>
				<MenubarContent class="bg-(--color-ui-menu-bg-inner) p-1 z-10 rounded rounded-tl-none">
					<MenubarItem class="menubar-item" @click="addCube">
						<span class="min-w-5"></span>Cube
					</MenubarItem>
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
	&[data-state='open'] {
		@apply bg-[#303030B3] brightness-125 rounded-b-none;
	}
}

.menubar-item {
	@apply cursor-pointer rounded px-1 py-0.5 bg-(--color-ui-menu-bg-inner) hover:bg-[#3D3D3DFF] flex flex-nowrap items-center min-w-32 gap-1;
}
</style>
