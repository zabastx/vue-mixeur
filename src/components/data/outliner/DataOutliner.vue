<template>
	<div
		class="block-border text-sm leading-6 flex flex-col overflow-hidden rounded bg-window-bg
			alternate-rows relative"
	>
		<h2 class="flex items-center gap-1 px-1 text-[1rem]">
			<MxIcon name="outliner/outliner" /> Outliner
			<MTooltip :tooltip="{ text: 'Add Group' }">
				<button class="btn ml-auto" type="button" @click="store.addGroup">
					<MxIcon name="ui/collection" />
				</button>
			</MTooltip>
		</h2>
		<ScrollContainer>
			<div class="flex justify-between items-center">
				<h3 class="flex items-center gap-1 px-1">
					<MxIcon name="ui/collection" /> Scene Collection
				</h3>
			</div>
			<Tree.Root
				v-slot="{ flattenItems }"
				v-model="selectedItem"
				:get-key="(val) => val.uuid"
				:items="outlinerItems"
				selection-behavior="replace"
			>
				<Tree.Item
					v-for="item in flattenItems"
					v-bind="item.bind"
					:key="item._id"
					v-slot="{ isExpanded }"
					:data-testid="item.value.uuid === selectedItem?.uuid ? 'outliner-selected' : undefined"
					as-child
					@select.prevent="store.selectObject($event.detail.value?.uuid)"
					@toggle="onToggle"
				>
					<DataOutlinerItem
						:item
						:is-expanded
						:visibility="item.value.visible"
						:is-selected="item.value.uuid === selectedItem?.uuid"
						@update:visibility="store.objectVisibilityUpdate(item.value.uuid, !item.value.visible)"
					/>
				</Tree.Item>
			</Tree.Root>
		</ScrollContainer>
	</div>
</template>

<script lang="ts" setup>
import { useThreeStore } from '@/store/three'
import type THREE from '@/three'
import { Tree } from 'reka-ui/namespaced'
import { computed, shallowRef, watch } from 'vue'
import type { TreeItemToggleEvent } from 'reka-ui'
import type { OutlinerItem } from './DataOutlinerItem.vue'

const store = useThreeStore()

const selectedItem = shallowRef<THREE.Object3D | THREE.Light>()

watch(
	() => store.selectedObject,
	(val) => {
		selectedItem.value = val ?? undefined
	},
	{
		immediate: true
	}
)

const outlinerItems = computed(() => {
	return store.sceneChildren.filter((item) => !item.userData.isHelper).map(parseObject)
})

function parseObject(obj: THREE.Object3D): OutlinerItem {
	return {
		uuid: obj.uuid,
		type: obj.type,
		name: obj.name || obj.type,
		visible: obj.visible,
		userData: obj.userData,
		children: obj.children.length > 0 ? obj.children.map(parseObject) : undefined
	}
}

function onToggle(e: TreeItemToggleEvent<OutlinerItem>) {
	const target = e.target as HTMLElement
	if ('toggle' in target.dataset) return
	e.preventDefault()
}
</script>
