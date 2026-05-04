<template>
	<div ref="sidebarRef" class="sidebar grid min-h-0 grid-rows-(--side-rows) rounded">
		<slot name="top"></slot>
		<div ref="divider" class="h-1 cursor-row-resize"></div>
		<slot name="bottom"></slot>
	</div>
</template>

<script lang="ts" setup>
import { onMounted, ref, useTemplateRef } from 'vue'
import { useEventListener } from '@vueuse/core'

const divider = useTemplateRef('divider')
const rowHeight = ref(window.innerHeight / 2)

useEventListener(divider, 'pointerdown', (e: PointerEvent) => {
	const startX = e.clientY
	const startWidth = rowHeight.value

	const move = (ev: PointerEvent) => {
		const delta = startX - ev.clientY
		rowHeight.value = Math.max(200, startWidth + delta)
	}

	const cancel = useEventListener(window, 'pointermove', move)
	useEventListener(window, 'pointerup', cancel)
})

const sidebarRef = useTemplateRef('sidebarRef')

onMounted(() => {
	if (sidebarRef.value) {
		rowHeight.value = sidebarRef.value.clientHeight / 2
	}
})
</script>

<style scoped>
.sidebar {
	--row-height: v-bind(rowHeight + 'px');
	--side-rows: 1fr min-content var(--row-height);
}
</style>
