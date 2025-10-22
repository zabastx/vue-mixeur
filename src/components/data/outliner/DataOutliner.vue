<template>
	<div
		class="block-border flex flex-col overflow-hidden rounded bg-(--color-window-bg) bg-[repeating-linear-gradient(to_bottom,var(--color-window-bg)_0rem,var(--color-window-bg)_1.5rem,#FFFFFF04_1.5rem,#FFFFFF04_3rem)]"
	>
		<h2 class="flex items-center gap-1 p-1 leading-0"><IconOutliner /> Outliner</h2>
		<ScrollContainer>
			<h3 class="flex items-center gap-1 p-1 leading-0"><IconCollection /> Scene Collection</h3>
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
					:style="{ paddingLeft: getPadding(item.level) }"
					class="relative flex snap-start items-center gap-1 hover:bg-(--color-outliner-active-highlight)"
					:class="{
						'bg-(--color-outliner-active-highlight) text-(--color-outliner-active-object)':
							item.value.uuid === selectedItem?.uuid
					}"
					@select="onSelect"
				>
					<IconArrowRight
						v-if="item.hasChildren"
						:class="{ 'rotate-90': isExpanded }"
						class="size-[1em] text-xs"
					/>
					<component :is="iconMap.get(item.value.type)" v-if="iconMap.get(item.value.type)" />
					{{ item.value.name }}
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
import { type SelectItemSelectEvent } from 'reka-ui'
import IconEmpty from '@/components/icons/outliner/IconEmpty.vue'

const store = useThreeStore()

const selectedItem = shallowRef<THREE.Object3D>()

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
		children: obj.children.length > 0 ? obj.children.map(parseObject) : undefined
	}
}

function onSelect(e: SelectItemSelectEvent<OutlinerItem>) {
	store.selectObject?.(e.detail.value?.uuid)
}

interface OutlinerItem {
	uuid: string
	type: string
	name: string
	children?: OutlinerItem[]
}

function getPadding(level: number) {
	if (level === 0) return '0'
	return `${level}em`
}

const iconMap = new Map([
	['PointLight', IconLightPoint],
	['SpotLight', IconLightSpot],
	['DirectionalLight', IconLightSun],
	['RectAreaLight', IconLightArea],
	['Mesh', IconMesh],
	['Group', IconGroup],
	['Object3D', IconEmpty]
])
</script>
