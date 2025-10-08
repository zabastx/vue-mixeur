<template>
	<div class="flex">
		<button
			v-for="(btn, index) in buttons"
			:key="btn.name"
			class="shading-btn"
			:class="{
				selected: btn.name === threeStore.currentShadingMode,
				'rounded-l': index === 0,
				'rounded-r': index === buttons.length - 1
			}"
			type="button"
			:title="btn.title"
			@click="setShadingMode(btn.name)"
		>
			<component :is="btn.icon" />
		</button>
	</div>
</template>

<script lang="ts" setup>
import { useThreeStore } from '@/store/three'
import type { ShadingMode } from '@/three/utils/renderer/ShadingControls'
import IconShadingWireframe from '../icons/shading/IconShadingWireframe.vue'
import type { Component } from 'vue'
import IconShadingSolid from '../icons/shading/IconShadingSolid.vue'
import IconShadingTexture from '../icons/shading/IconShadingTexture.vue'
import IconShadingRendered from '../icons/shading/IconShadingRendered.vue'

const threeStore = useThreeStore()

function setShadingMode(mode: ShadingMode) {
	threeStore.currentShadingMode = mode
}

const buttons: ShadingControlsElement[] = [
	{
		name: 'wireframe',
		icon: IconShadingWireframe,
		title: 'Viewport Shading: Wireframe'
	},
	{
		name: 'solid',
		icon: IconShadingSolid,
		title: 'Viewport Shading: Solid'
	},
	{
		name: 'materialPreview',
		icon: IconShadingTexture,
		title: 'Viewport Shading: Material Preview'
	},
	{
		name: 'rendered',
		icon: IconShadingRendered,
		title: 'Viewport Shading: Rendered'
	}
]

interface ShadingControlsElement {
	name: ShadingMode
	title: string
	icon: Component
}
</script>

<style scoped>
@reference 'tailwindcss/theme';

.shading-btn {
	@apply bg-(--color-ui-radio-button-inner) p-0.5 cursor-pointer;
	&.selected {
		@apply bg-(--color-ui-radio-button-selected);
	}
}
</style>
