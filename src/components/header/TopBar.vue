<template>
	<header class="flex items-center bg-topbar-background p-1 px-2">
		<MenuBar :items="menuItems" />
		<a
			href="https://github.com/zabastx/mixeur"
			class="ml-auto text-xl"
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
import { useModals } from '@/composables/useModals'

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
						label: 'Import from file',
						onClick: () => {
							open('importScene')
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
</script>
