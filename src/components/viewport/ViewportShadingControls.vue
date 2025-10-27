<template>
	<div class="flex">
		<MTooltip
			v-for="(btn, index) in buttons"
			:key="btn.name"
			:content="{ align: 'start', side: 'bottom', alignOffset: -10, sideOffset: 10 }"
		>
			<button
				class="cursor-pointer bg-ui-radio-button-inner p-0.5"
				:class="{
					'bg-ui-radio-button-selected': btn.name === threeStore.currentShadingMode,
					'rounded-l': index === 0,
					'rounded-r': index === buttons.length - 1
				}"
				type="button"
				@click="setShadingMode(btn.name)"
			>
				<component :is="btn.icon" />
			</button>
			<template #content>
				<!-- eslint-disable vue/no-v-html -->
				<span v-html="btn.tooltip.title"></span>
				<!-- eslint-enable -->
				<p class="mt-1">Method to display/shade objects in the 3D View</p>
				<span class="text-[.9em] opacity-50">{{ btn.tooltip.footer }}</span>
			</template>
		</MTooltip>
	</div>
</template>

<script lang="ts" setup>
import { useThreeStore } from '@/store/three'
import type { ShadingMode } from '@/three/modules/renderer/ShadingControls'
import IconShadingWireframe from '../icons/shading/IconShadingWireframe.vue'
import type { Component } from 'vue'
import IconShadingSolid from '../icons/shading/IconShadingSolid.vue'
import IconShadingTexture from '../icons/shading/IconShadingTexture.vue'
import IconShadingRendered from '../icons/shading/IconShadingRendered.vue'
import MTooltip, { type MTooltipContent } from '../utils/MTooltip.vue'

const threeStore = useThreeStore()

function setShadingMode(mode: ShadingMode) {
	threeStore.currentShadingMode = mode
}

const buttons: ShadingControlsElement[] = [
	{
		name: 'wireframe',
		icon: IconShadingWireframe,
		tooltip: {
			title: 'Viewport Shading: <em>Wireframe</em>',
			footer: 'Display only edges of geometry without surface shading'
		}
	},
	{
		name: 'solid',
		icon: IconShadingSolid,
		tooltip: {
			title: 'Viewport Shading: <em>Solid</em>',
			footer: 'Display objects with flat lighting and basic surface shading'
		}
	},
	{
		name: 'materialPreview',
		icon: IconShadingTexture,
		tooltip: {
			title: 'Viewport Shading: <em>Material Preview</em>',
			footer: 'Preview materials using predefined environment lights'
		}
	},
	{
		name: 'rendered',
		icon: IconShadingRendered,
		tooltip: {
			title: 'Viewport Shading: <em>Rendered</em>',
			footer: 'Preview the final scene using the active render engine'
		}
	}
]

interface ShadingControlsElement {
	name: ShadingMode
	icon: Component
	tooltip: Partial<MTooltipContent>
}
</script>

<style scoped>
@reference 'tailwindcss/theme';

:deep(em) {
	@apply text-[#4772B3] not-italic;
}
</style>
