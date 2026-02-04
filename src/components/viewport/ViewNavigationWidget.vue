<template>
	<MTooltip
		:tooltip="{
			text: 'Switch the current view from perspective/orthographic projection',
			footer: 'Shortcut: Numpad 5'
		}"
		:options="{
			content: {
				align: 'start',
				alignOffset: -10,
				side: 'bottom',
				sideOffset: 5
			}
		}"
	>
		<button
			type="button"
			class="cursor-pointer rounded-full bg-black p-1.5 text-xl text-white opacity-50
				hover:bg-gray-500"
			v-bind="$attrs"
			@click="sceneStore.switchCamera"
		>
			<IconViewPerspective v-if="sceneStore.activeCamera.type === 'PerspectiveCamera'" />
			<IconViewOrtho v-else />
		</button>
	</MTooltip>
</template>

<script lang="ts" setup>
import { useThreeStore } from '@/store/three'

const sceneStore = useThreeStore()
</script>
