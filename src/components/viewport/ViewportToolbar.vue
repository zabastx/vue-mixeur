<template>
	<div class="absolute top-10 left-2.5 flex flex-col text-3xl">
		<MTooltip
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
					'bg-ui-toolbar-selected': item.name === threeStore.currentTransformMode
				}"
				:title="item.title"
				@click="item.onClick"
			>
				<component :is="item.icon" />
			</button>
		</MTooltip>
	</div>
</template>

<script lang="ts" setup>
import { useThreeStore } from '@/store/three'
import IconToolMove from '../icons/toolbar/IconToolMove.vue'
import IconToolRotate from '../icons/toolbar/IconToolRotate.vue'
import IconToolScale from '../icons/toolbar/IconToolScale.vue'
import MTooltip from '../utils/MTooltip.vue'

const threeStore = useThreeStore()

const toolbarItems = [
	{
		name: 'translate',
		icon: IconToolMove,
		onClick: () => {
			threeStore.setTransformMode('translate')
		},
		title: 'Move',
		tooltip: 'Move selected items',
		footer: 'G'
	},
	{
		name: 'rotate',
		icon: IconToolRotate,
		onClick: () => {
			threeStore.setTransformMode('rotate')
		},
		title: 'Rotate',
		tooltip: 'Rotate selected items',
		footer: 'R'
	},
	{
		name: 'scale',
		icon: IconToolScale,
		onClick: () => {
			threeStore.setTransformMode('scale')
		},
		title: 'Scale',
		tooltip: 'Scale (resize) selected items',
		footer: 'S'
	}
] as const
</script>
