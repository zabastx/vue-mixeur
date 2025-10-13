<template>
	<header class="bg-(--color-topbar-background) p-1 px-2">
		<MenuBar :items="menuItems" />
	</header>
</template>

<script lang="ts" setup>
import IconImport from '../icons/IconImport.vue'
import IconMixeur from '../icons/IconMixeur.vue'
import MenuBar, { type IMenubarMenu } from '../utils/MenuBar.vue'

const menuItems: IMenubarMenu[] = [
	{
		label: 'mixuer',
		icon: IconMixeur,
		items: [
			{
				type: 'item',
				key: 'splash',
				label: 'Splash Screen',
				onClick() {}
			},
			{
				type: 'item',
				key: 'about',
				label: 'About Mixeur',
				onClick() {}
			}
		]
	},
	{
		label: 'File',
		items: [
			{
				type: 'sub',
				key: 'import',
				label: 'Import',
				icon: IconImport,
				items: [
					{
						type: 'item',
						key: 'import_gltf',
						label: 'glTF 2.0 (.gltf/.glb)',
						onClick: () => {
							// getFile('gltf')
						}
					},
					{
						type: 'item',
						key: 'import_obj',
						label: 'Wavefront (.obj)',
						onClick: () => {
							// getFile('obj')
						}
					},
					{
						type: 'item',
						key: 'import_fbx',
						label: 'FBX (.fbx)',
						onClick: () => {
							// getFile('fbx')
						}
					}
				]
			}
		]
	}
]
</script>
