<template>
	<MenubarRoot class="text-sm flex z-10 relative">
		<MenubarMenu>
			<MenubarTrigger class="menubar-group">
				<IconMixeur />
			</MenubarTrigger>
			<MenubarContent class="bg-[#181818FF] p-1">
				<MenubarItem class="menubar-item"><span class="min-w-5"></span>Splash Screen</MenubarItem>
				<MenubarItem class="menubar-item"><span class="min-w-5"></span>About Mixeur</MenubarItem>
			</MenubarContent>
		</MenubarMenu>
		<MenubarMenu v-for="menuItem in menu" :key="menuItem.label">
			<MenubarTrigger class="menubar-group">{{ menuItem.label }}</MenubarTrigger>
			<MenubarContent class="bg-[#181818FF] p-1">
				<template v-for="item in menuItem.items" :key="item.label">
					<MenubarItem v-if="!item.children" class="menubar-item" @click="item.onClick">
						<span class="min-w-5"><component :is="item.icon" /></span>
						{{ item.label }}
					</MenubarItem>
					<MenubarSub v-else>
						<MenubarSubTrigger class="menubar-item">
							<span class="min-w-5"><component :is="item.icon" /></span>
							{{ item.label }}
							<span class="ml-auto">
								<IconArrowRight />
							</span>
						</MenubarSubTrigger>
						<MenubarSubContent class="bg-[#181818FF] p-1">
							<MenubarItem
								v-for="subItem in item.children"
								:key="subItem.label"
								class="menubar-item"
								@click="subItem.onClick"
							>
								<span class="min-w-5"><component :is="subItem.icon" v-if="subItem.icon" /></span>
								{{ subItem.label }}
							</MenubarItem>
						</MenubarSubContent>
					</MenubarSub>
				</template>
			</MenubarContent>
		</MenubarMenu>
	</MenubarRoot>
</template>

<script lang="ts" setup>
import { useThreeStore } from '@/store/three'
import IconImport from '../icons/IconImport.vue'

const menu = [
	{
		label: 'File',
		items: [
			{
				label: 'Import',
				icon: IconImport,
				onClick: null,
				children: [
					{
						label: 'glTF 2.0 (.gltf/.glb)',
						icon: null,
						onClick: () => {
							getFile('gltf')
						}
					},
					{
						label: 'Wavefront (.obj)',
						icon: null,
						onClick: () => {
							getFile('obj')
						}
					},
					{
						label: 'FBX (.fbx)',
						icon: null,
						onClick: () => {
							getFile('fbx')
						}
					}
				]
			}
			// {
			// 	label: 'Export',
			// 	children: null,
			// 	onClick: () => {}
			// }
		]
	}
] as const

const sceneStore = useThreeStore()

function getFile(format: Parameters<typeof sceneStore.importModel>[0]['format']) {
	const input = document.createElement('input')
	input.type = 'file'

	if (format === 'gltf') {
		input.accept = '.gltf,.glb'
	} else {
		input.accept = `.${format}`
	}

	input.addEventListener('change', (e: Event) => {
		const $input = e.target as HTMLInputElement
		const file = $input.files?.[0]
		if (!file) return
		const fileUrl = URL.createObjectURL(file)
		sceneStore.importModel({
			url: fileUrl,
			format: format.toLowerCase(),
			onProgress(e) {
				if (e.lengthComputable) {
					// console.log('Progress:', (e.loaded / e.total) * 100)
				}
			}
		})
	})
	input.showPicker()
	input.remove()
}
</script>

<style scoped>
@reference 'tailwindcss/theme';

.menubar-group {
	@apply cursor-pointer rounded px-1 py-0.5 bg-[#181818FF] hover:bg-[#3D3D3DFF];
}

.menubar-item {
	@apply cursor-pointer rounded px-1 py-0.5 bg-[#181818FF] hover:bg-[#3D3D3DFF] flex flex-nowrap items-center min-w-40 gap-1;
}
</style>
