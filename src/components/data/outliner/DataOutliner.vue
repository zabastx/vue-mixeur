<template>
	<div
		class="block-border text-sm leading-6 flex flex-col overflow-hidden rounded bg-window-bg
			alternate-rows relative"
	>
		<h2 class="flex items-center gap-1 px-1 text-[1rem]"><IconOutliner /> Outliner</h2>
		<ScrollContainer>
			<h3 class="flex items-center gap-1 px-1"><IconCollection /> Scene Collection</h3>
			<Tree.Root
				v-slot="{ flattenItems }"
				v-model="selectedItem"
				:get-key="(val) => val.uuid"
				:items="outlinerItems"
				selection-behavior="replace"
			>
				<Tree.Item
					v-for="item in flattenItems.filter((item) => !item.value.userData.isHelper)"
					v-bind="item.bind"
					:key="item._id"
					v-slot="{ isExpanded }"
					:style="{ paddingLeft: getPadding(item.level) }"
					class="relative flex snap-start items-center gap-1 pr-5
						hover:bg-outliner-active-highlight"
					:class="{
						'bg-outliner-active-highlight text-outliner-active-object':
							item.value.uuid === selectedItem?.uuid
					}"
					@select="onSelect"
					@toggle="onToggle"
				>
					<IconArrowRight
						v-if="item.hasChildren"
						:class="{ 'rotate-90': isExpanded }"
						class="size-[1.5em] p-0.5 shrink-0 text-xs"
						data-toggle
					/>
					<component :is="iconMap.get(item.value.type) || IconEmpty" class="shrink-0" />
					<span class="overflow-hidden text-ellipsis whitespace-nowrap grow">
						{{ item.value.name }}
					</span>
					<div class="contents" @click.stop>
						<CheckboxRoot
							class="ml-auto"
							:model-value="item.value.visible"
							@update:model-value="
								store.objectVisibilityUpdate(item.value.uuid, !item.value.visible)
							"
						>
							<IconVisibility :visible="item.value.visible" />
						</CheckboxRoot>
					</div>
				</Tree.Item>
			</Tree.Root>
		</ScrollContainer>
	</div>
</template>

<script lang="ts" setup>
import {
	IconLightArea,
	IconLightPoint,
	IconLightSpot,
	IconLightSun
} from '@/components/icons/light'
import { IconMesh } from '@/components/icons/mesh'
import IconGroup from '@/components/icons/outliner/IconGroup.vue'
import { useThreeStore } from '@/store/three'
import type THREE from '@/three'
import { Tree } from 'reka-ui/namespaced'
import { computed, shallowRef, watch } from 'vue'
import { type SelectItemSelectEvent, type TreeItemToggleEvent } from 'reka-ui'
import IconEmpty from '@/components/icons/outliner/IconEmpty.vue'

const store = useThreeStore()

const selectedItem = shallowRef<THREE.Object3D | THREE.Light>()

watch(
	() => store.selectedObject,
	(val) => {
		selectedItem.value = val ?? undefined
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

function onSelect(e: SelectItemSelectEvent<OutlinerItem>) {
	const target = e.target as HTMLElement
	if ('toggle' in target.dataset) return e.preventDefault()
	store.selectObject?.(e.detail.value?.uuid)
}

function onToggle(e: TreeItemToggleEvent<OutlinerItem>) {
	const target = e.target as HTMLElement
	if ('toggle' in target.dataset) return
	e.preventDefault()
}

function getPadding(level: number) {
	if (level === 0) return '0'
	return `${level * 1.5}em`
}

const iconMap = new Map([
	['PointLight', IconLightPoint],
	['SpotLight', IconLightSpot],
	['DirectionalLight', IconLightSun],
	['RectAreaLight', IconLightArea],
	['Mesh', IconMesh],
	['Group', IconGroup]
])

interface OutlinerItem {
	uuid: string
	type: string
	name: string
	visible: boolean
	userData: Record<string, unknown>
	children?: OutlinerItem[]
}
</script>
