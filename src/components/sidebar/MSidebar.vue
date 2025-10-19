<template>
	<div class="sidebar grid min-h-0 grid-rows-(--side-rows) rounded">
		<DataOutliner />
		<div ref="divider" class="h-1 cursor-row-resize"></div>
		<DataProperties />
	</div>
</template>

<script lang="ts" setup>
import { ref, useTemplateRef } from 'vue'
import { useEventListener } from '@vueuse/core'

const divider = useTemplateRef('divider')
const rowHeight = ref(500)

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
</script>

<style scoped>
.sidebar {
	--row-height: v-bind(rowHeight + 'px');
	--side-rows: 1fr min-content var(--row-height);
}
</style>
