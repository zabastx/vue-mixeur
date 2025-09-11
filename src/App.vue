<template>
	<div class="flex flex-col h-full bg-gray-900 text-gray-200 font-sans">
		<TopBar />

		<main class="flex-1 grid grid-cols-(--main-cols) p-1 min-h-0 bg-[#161616] select-none">
			<MViewport class="block-border" />
			<div ref="divider" class="divider w-1 cursor-col-resize"></div>
			<MSidebar />
		</main>

		<StatusBar />
	</div>
</template>

<script lang="ts" setup>
import { ref, useTemplateRef } from 'vue'
import MSidebar from './components/sidebar/MSidebar.vue'
import { useEventListener } from '@vueuse/core'
import MViewport from './components/viewport/MViewport.vue'
import StatusBar from './components/status/StatusBar.vue'
import TopBar from './components/header/TopBar.vue'

const divider = useTemplateRef('divider')
const rightWidth = ref(window.innerWidth * 0.3)

useEventListener(divider, 'pointerdown', (e: PointerEvent) => {
	const startX = e.clientX
	const startWidth = rightWidth.value

	const move = (ev: PointerEvent) => {
		const delta = startX - ev.clientX
		rightWidth.value = Math.max(200, startWidth + delta)
	}

	const cancel = useEventListener(window, 'pointermove', move)
	useEventListener(window, 'pointerup', cancel)
})
</script>

<style scoped>
main {
	--col-width: v-bind(rightWidth + 'px');
	--main-cols: 1fr min-content var(--col-width);
}
</style>
