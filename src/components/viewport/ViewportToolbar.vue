<template>
	<div class="toolbar">
		<button
			v-for="item in toolbarItems"
			:key="'toolbar_' + item.name"
			type="button"
			:class="{ selected: item.name === threeStore.currentTransformMode }"
			:title="item.title"
			@click="item.onClick"
		>
			<component :is="item.icon" />
		</button>
	</div>
</template>

<script lang="ts" setup>
import { useThreeStore } from '@/store/three'
import IconToolMove from '../icons/toolbar/IconToolMove.vue'
import IconToolRotate from '../icons/toolbar/IconToolRotate.vue'
import IconToolScale from '../icons/toolbar/IconToolScale.vue'

const threeStore = useThreeStore()

const toolbarItems = [
	{
		name: 'translate',
		icon: IconToolMove,
		onClick: () => {
			threeStore.setTransformMode('translate')
		},
		title: 'Translate'
	},
	{
		name: 'rotate',
		icon: IconToolRotate,
		onClick: () => {
			threeStore.setTransformMode('rotate')
		},
		title: 'Rotate'
	},
	{
		name: 'scale',
		icon: IconToolScale,
		onClick: () => {
			threeStore.setTransformMode('scale')
		},
		title: 'Scale'
	}
] as const
</script>

<style scoped>
@reference 'tailwindcss/theme';

.toolbar {
	@apply absolute left-2.5 top-10 flex flex-col text-3xl;
	& > button {
		@apply bg-(--color-ui-toolbar-inner) cursor-pointer p-1 border-[0.5px] border-(--color-ui-toolbar-outline) first:rounded-t-md last:rounded-b-md;
	}
	.selected {
		@apply bg-(--color-ui-toolbar-selected);
	}
}
</style>
