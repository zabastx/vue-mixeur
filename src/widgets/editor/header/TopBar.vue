<template>
	<header class="flex items-center bg-topbar-background p-1 px-2 gap-2">
		<MenuBar :items="menuItems" />
		<button
			v-if="isUpdateAvailable"
			class="ml-auto text-xs cursor-pointer flex gap-1 hover:brightness-125 border-ui-box-outline
				border px-1 rounded"
			title="New version available - click to update"
			@click="updateApp"
		>
			<MxIcon name="file/refresh" />
			New Version Available
		</button>
		<a
			href="https://github.com/zabastx/mixeur"
			class="text-xl"
			target="_blank"
			title="GitHub repository"
			:class="{ 'ml-auto': !isUpdateAvailable }"
		>
			<MxIcon name="misc/github" />
		</a>
	</header>
</template>

<script lang="ts" setup>
import { useAppStore } from '@/app/model/app'
import { computed } from 'vue'
import { useThreeStore } from '@/app/model/three'
import { useModals } from '@/shared/lib/modals'
import { usePWAUpdate } from '@/app/composables/usePWAUpdate'
import type { IMenubarMenu } from '@/shared/ui/MenuBar.vue'

const appStore = useAppStore()
const threeStore = useThreeStore()
const { open } = useModals()

const { isUpdateAvailable, updateApp } = usePWAUpdate()

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
		label: 'Edit',
		items: [
			{
				label: 'Preferences',
				type: 'item',
				key: 'preferences',
				icon: 'misc/preferences',
				onClick() {
					open('preferences')
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
