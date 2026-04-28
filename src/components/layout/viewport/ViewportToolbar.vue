<template>
	<div class="flex flex-col text-3xl items-start">
		<MxTooltip
			v-for="item in toolbarItems"
			:key="'toolbar_' + item.name"
			:tooltip="{ title: item.title, text: item.tooltip, footer: `Shortcut: ${item.footer}` }"
			:options="{
				content: { align: 'start', side: 'right', sideOffset: 5 }
			}"
		>
			<button
				type="button"
				class="cursor-pointer border-[0.5px] border-ui-toolbar-outline bg-ui-toolbar-inner p-1
					first:rounded-t last:rounded-b last:border-t-0 first:border-b-0"
				:class="{
					'bg-ui-toolbar-inner-selected': item.name === controlsStore.currentTransformMode
				}"
				:title="item.title"
				:data-testid="`toolbar-btn-${item.name}`"
				:data-active="item.name === controlsStore.currentTransformMode"
				@click="item.onClick"
			>
				<MxIcon :name="item.icon" />
			</button>
		</MxTooltip>
	</div>
</template>

<script lang="ts" setup>
import { useControlsStore } from '@/store/controls'

const controlsStore = useControlsStore()

const toolbarItems: ToolbarItem[] = [
	{
		name: 'translate',
		icon: 'toolbar/tool-move',
		onClick: () => {
			controlsStore.currentTransformMode = 'translate'
		},
		title: 'Move',
		tooltip: 'Move selected items',
		footer: 'G'
	},
	{
		name: 'rotate',
		icon: 'toolbar/tool-rotate',
		onClick: () => {
			controlsStore.currentTransformMode = 'rotate'
		},
		title: 'Rotate',
		tooltip: 'Rotate selected items',
		footer: 'R'
	},
	{
		name: 'scale',
		icon: 'toolbar/tool-scale',
		onClick: () => {
			controlsStore.currentTransformMode = 'scale'
		},
		title: 'Scale',
		tooltip: 'Scale (resize) selected items',
		footer: 'S'
	}
]

interface ToolbarItem {
	name: 'rotate' | 'scale' | 'translate'
	title: string
	tooltip: string
	icon: MxIconName
	onClick: () => unknown
	footer: 'G' | 'R' | 'S'
}
</script>
