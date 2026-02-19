<template>
	<div class="flex">
		<MxTooltip
			v-for="(btn, index) in buttons"
			:key="btn.name"
			:content="{ align: 'start', side: 'bottom', alignOffset: -10, sideOffset: 10 }"
		>
			<button
				class="cursor-pointer bg-ui-radio-inner p-0.5 hover:brightness-125"
				:class="{
					'bg-ui-radio-inner-selected': btn.name === shadingStore.shadingMode,
					'rounded-l': index === 0,
					'rounded-r': index === buttons.length - 1
				}"
				type="button"
				@click="shadingStore.setMode(btn.name)"
			>
				<MxIcon :name="btn.icon" />
			</button>
			<template #content>
				<!-- eslint-disable vue/no-v-html -->
				<span v-html="btn.tooltip.title"></span>
				<!-- eslint-enable -->
				<p class="mt-1">Method to display/shade objects in the 3D View</p>
				<span class="text-[.9em] opacity-50">{{ btn.tooltip.footer }}</span>
			</template>
		</MxTooltip>
	</div>
</template>

<script lang="ts" setup>
import MxTooltip, { type MxTooltipContent } from '../utils/MxTooltip.vue'
import { useShadingStore, type ShadingMode } from '@/store/shading'

const shadingStore = useShadingStore()

const buttons: ShadingControlsElement[] = [
	{
		name: 'wireframe',
		icon: 'shading/shading-wireframe',
		tooltip: {
			title: 'Viewport Shading: <em>Wireframe</em>',
			footer: 'Display only edges of geometry without surface shading'
		}
	},
	{
		name: 'solid',
		icon: 'shading/shading-solid',
		tooltip: {
			title: 'Viewport Shading: <em>Solid</em>',
			footer: 'Display objects with flat lighting and basic surface shading'
		}
	},
	{
		name: 'materialPreview',
		icon: 'shading/shading-preview',
		tooltip: {
			title: 'Viewport Shading: <em>Material Preview</em>',
			footer: 'Preview materials using predefined environment lights'
		}
	},
	{
		name: 'rendered',
		icon: 'shading/shading-rendered',
		tooltip: {
			title: 'Viewport Shading: <em>Rendered</em>',
			footer: 'Preview the final scene using the active render engine'
		}
	}
]

interface ShadingControlsElement {
	name: ShadingMode
	icon: MxIconName
	tooltip: Partial<MxTooltipContent>
}
</script>

<style scoped>
@reference 'tailwindcss/theme';

:deep(em) {
	@apply text-[#4772B3] not-italic;
}
</style>
