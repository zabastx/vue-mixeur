<template>
	<div v-show="appStore.pointerOnCanvas" class="flex items-center gap-1 text-xl select-none">
		<div v-for="item in activeHints" :key="item.text" class="align-center flex">
			<component :is="item.icon" />
			<span class="text-xs">{{ item.text }}</span>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import IconLMB from '../icons/IconLMB.vue'
import IconMMB from '../icons/IconMMB.vue'
import { useAppStore } from '@/store/app'

const appStore = useAppStore()

const keymapList = [
	{ icon: IconLMB, text: 'Select', key: null },
	{ icon: IconMMB, text: 'Rotate View', key: null },
	{ icon: IconLMB, text: 'Select Toggle', key: 'shift' },
	{ icon: IconMMB, text: 'Screen Space Pan View', key: 'shift' },
	{ icon: IconMMB, text: 'Pan View', key: 'ctrl' }
] as const

const activeHints = computed(() => {
	if (appStore.isCtrlDown) {
		return keymapList.filter((item) => item.key === 'ctrl')
	}
	if (appStore.isShiftDown) {
		return keymapList.filter((item) => item.key === 'shift')
	}
	return keymapList.filter((item) => !item.key)
})
</script>
