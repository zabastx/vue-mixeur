<template>
	<header class="flex items-center bg-topbar-background p-1 px-2">
		<MenuBar :items="menuItems" />
		<a
			href="https://github.com/zabastx/vue-mixeur"
			class="ml-auto text-xl"
			target="_blank"
			title="GitHub repository"
		>
			<IconGithub />
		</a>
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
import { useToast } from '@/composables/useToast'
import type { loadModel } from '@/three/modules/loaders/modelLoader'
import IconExport from '../icons/misc/IconExport.vue'
import IconRenderImage from '../icons/IconRenderImage.vue'
import { useModals } from '@/composables/useModals'
import { uploadFile } from '@/utils/files'

const appStore = useAppStore()
const threeStore = useThreeStore()
const { open } = useModals()

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
			// {
			// 	type: 'item',
			// 	key: 'splash',
			// 	label: 'Splash Screen',
			// 	onClick() {}
			// },
			{
				type: 'item',
				key: 'about',
				label: 'About Mixeur',
				onClick() {
					open('about')
				}
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
						label: 'glTF 2.0 (.glb)',
						onClick: () => {
							importFile('glb')
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
						key: 'import_library',
						label: 'Import from library',
						onClick: () => {
							open('modelsLibrary')
						}
					}
				]
			},
			{
				type: 'item',
				key: 'export',
				label: 'Export',
				icon: IconExport,
				onClick() {
					threeStore.exportScene()
				}
			}
		]
	},
	{
		label: 'Render',
		items: [
			{
				type: 'item',
				key: 'render_image',
				label: 'Render Image',
				icon: IconRenderImage,
				onClick() {
					open('renderImage')
				}
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
	const { data } = await uploadFile(`.${format}`)
	if (!data) return
	try {
		await sceneStore.importModel({ filename: data.filename, url: data.url, format })
	} catch (e) {
		console.error(e)
		toast.error(`Failed to import ${format} file`)
	} finally {
		data?.cleanup()
	}
}
</script>
