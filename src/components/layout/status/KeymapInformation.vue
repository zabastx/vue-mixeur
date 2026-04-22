<template>
	<div v-show="appStore.pointerOnCanvas" class="flex items-center gap-1 text-xl select-none">
		<div v-for="item in activeHints" :key="item.text" class="align-center flex">
			<MxIcon :name="item.icon" />
			<span class="text-xs">{{ item.text }}</span>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useAppStore } from '@/store/app'

const appStore = useAppStore()

const keymapList: KeymapOption[] = [
	{ icon: 'keys/lmb', text: 'Select', key: null },
	{ icon: 'keys/mmb', text: 'Rotate View', key: null },
	{ icon: 'keys/lmb', text: 'Select Toggle', key: 'shift' },
	{ icon: 'keys/mmb', text: 'Screen Space Pan View', key: 'shift' },
	{ icon: 'keys/mmb', text: 'Pan View', key: 'ctrl' }
]

const activeHints = computed(() => {
	if (appStore.isCtrlDown) {
		return keymapList.filter((item) => item.key === 'ctrl')
	}
	if (appStore.isShiftDown) {
		return keymapList.filter((item) => item.key === 'shift')
	}
	return keymapList.filter((item) => !item.key)
})

interface KeymapOption {
	icon: MxIconName
	text: string
	key: 'ctrl' | 'shift' | null
}
</script>
