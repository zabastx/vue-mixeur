<template>
	<button
		type="button"
		class="text-white text-xl bg-black opacity-50 cursor-pointer p-1.5 rounded-full hover:bg-gray-500"
		@click="sceneStore.switchCamera"
	>
		<IconViewPerspective v-if="sceneStore.activeCamera.type === 'PerspectiveCamera'" />
		<IconViewOrtho v-else />
	</button>
</template>

<script lang="ts" setup>
import { useThreeStore } from '@/store/three'

const sceneStore = useThreeStore()
</script>
