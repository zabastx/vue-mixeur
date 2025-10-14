<template>
	<header class="bg-(--color-topbar-background) p-1 px-2">
		<MenuBar :items="menuItems" />
	</header>
</template>

<script lang="ts" setup>
import { useAppStore } from '@/store/app'
import IconImport from '../icons/IconImport.vue'
import IconMixeur from '../icons/IconMixeur.vue'
import IconFullScreen from '../icons/misc/IconFullScreen.vue'
import MenuBar, { type IMenubarMenu } from '../utils/MenuBar.vue'
import { computed } from 'vue'
import { useThreeStore } from '@/store/three'
import { getFile } from '@/composables/getfile'
import { useToast } from '@/composables/useToast'
import type { loadModel } from '@/three/utils/loaders/modelLoader'

const appStore = useAppStore()

const showStatusBar = computed({
	get() {
		return appStore.showStatusBar
	},
	set(val) {
		appStore.showStatusBar = val
	}
})

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
							importFile('gltf')
						}
					},
					{
						type: 'item',
						key: 'import_obj',
						label: 'Wavefront (.obj)',
						onClick: () => {
							importFile('obj')
						}
					},
					{
						type: 'item',
						key: 'import_fbx',
						label: 'FBX (.fbx)',
						onClick: () => {
							importFile('fbx')
						}
					}
				]
			}
		]
	},
	{
		label: 'Window',
		items: [
			{
				type: 'item',
				key: 'window_fullscreen',
				label: 'Toggle Window Fullscreen',
				icon: IconFullScreen,
				onClick() {
					if (document.fullscreenElement) {
						document.exitFullscreen()
					} else {
						document.documentElement.requestFullscreen()
					}
				}
			},
			{
				type: 'separator',
				key: 'sep1'
			},
			{
				type: 'checkbox',
				key: 'window_status_bar',
				label: 'Show Status Bar',
				model: showStatusBar
			}
		]
	}
]

const sceneStore = useThreeStore()
const { toast } = useToast()

async function importFile(format: Parameters<typeof loadModel>[0]['format']) {
	try {
		const file = await getFile(format)
		await sceneStore.importModel(file)
	} catch (e) {
		console.error(e)
		toast.error(`Failed to import ${format.toUpperCase()} file`)
	}
}
</script>
