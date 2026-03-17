<template>
	<header class="flex items-center bg-topbar-background p-1 px-2">
		<MenuBar :items="menuItems" class="mr-auto" />
		<button
			v-if="needRefresh"
			class="btn cursor-pointer mr-2 flex items-center gap-1 px-2 py-1 text-xs"
			@click="update"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="16"
				height="16"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
			>
				<path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" />
				<path d="M21 3v5h-5" />
			</svg>
			Update available
		</button>
		<a
			href="https://github.com/zabastx/vue-mixeur"
			class="text-xl"
			target="_blank"
			title="GitHub repository"
		>
			<MxIcon name="misc/github" />
		</a>
	</header>
</template>

<script lang="ts" setup>
import { useAppStore } from '@/store/app'
import MenuBar, { type IMenubarMenu } from '../utils/MenuBar.vue'
import { computed } from 'vue'
import { useThreeStore } from '@/store/three'
import { useToast } from '@/composables/toast'
import type { loadModel } from '@/three/modules/loaders/modelLoader'
import { useModals } from '@/composables/useModals'
import { usePwaUpdate } from '@/composables/usePwaUpdate'
import { uploadFile } from '@/utils/files'

const appStore = useAppStore()
const threeStore = useThreeStore()
const { open } = useModals()
const { needRefresh, update } = usePwaUpdate()

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
		label: 'mixeur',
		icon: 'mixeur',
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
				icon: 'ui/import',
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
				icon: 'misc/export',
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
				icon: 'ui/render-image',
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
				icon: 'misc/full-screen',
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
const toast = useToast()

async function importFile(format: Parameters<typeof loadModel>[0]['format']) {
	const { data } = await uploadFile(`.${format}`)
	if (!data) return
	try {
		await sceneStore.importModel({ filename: data.filename, url: data.url, format })
	} catch (e) {
		console.error(e)
		toast.add({ type: 'error', message: `Failed to import ${format} file` })
	} finally {
		data?.cleanup()
	}
}
</script>
