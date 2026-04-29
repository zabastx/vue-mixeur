<template>
	<div v-show="appStore.pointerOnCanvas" class="flex items-center gap-2 text-xs select-none">
		<div v-for="item in activeHints" :key="item.text" class="align-center flex gap-1">
			<MxIcon v-if="item.icon" class="text-xl" :name="item.icon" />
			<div v-if="item.textHint" class="space-x-0.5">
				<span v-for="hint in item.textHint" :key="item.key + hint" class="border rounded px-1">
					{{ hint }}
				</span>
			</div>
			<span>{{ item.text }}</span>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useAppStore } from '@/app/model/app'
import { useControlsStore } from '@/app/model/controls'

const appStore = useAppStore()
const controlsStore = useControlsStore()

const keymapList: KeymapOption[] = [
	{ icon: 'input/lmb', text: 'Select', key: null },
	{ icon: 'input/mmb', text: 'Rotate View', key: null },
	{ icon: 'input/mmb', text: 'Screen Space Pan View', key: 'shift' },
	{ icon: 'input/mmb', text: 'Pan View', key: 'ctrl' }
]

const transfromControlsHints: KeymapOption[] = [
	{
		textHint: ['X', 'Y', 'Z'],
		key: null,
		text: 'Axis'
	},
	{
		textHint: ['C'],
		key: null,
		text: 'Clear Constraints'
	},
	{
		textHint: ['Ctrl'],
		key: null,
		text: 'Snap'
	},
	{
		textHint: ['ESC'],
		key: null,
		text: 'Cancel'
	}
]

const activeHints = computed(() => {
	if (controlsStore.isTransformDrag) {
		return transfromControlsHints
	}
	if (appStore.isCtrlDown) {
		return keymapList.filter((item) => item.key === 'ctrl')
	}
	if (appStore.isShiftDown) {
		return keymapList.filter((item) => item.key === 'shift')
	}
	return keymapList.filter((item) => !item.key)
})

interface KeymapOption {
	icon?: MxIconName
	textHint?: string[]
	text: string
	key: 'ctrl' | 'shift' | null
}
</script>
