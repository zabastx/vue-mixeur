<template>
	<li
		:style="{ paddingLeft: getPadding(item.level) }"
		class="relative flex snap-start items-center gap-1 pr-5 hover:bg-outliner-active-highlight"
		:class="{
			'bg-outliner-active-highlight text-outliner-active-object': isSelected
		}"
	>
		<MxIcon
			v-if="item.hasChildren"
			name="ui/arrow-right"
			:class="{ 'rotate-90': isExpanded }"
			class="size-[1.5em] p-0.5 shrink-0 text-xs"
			data-toggle
		/>
		<MxIcon :name="iconMap.get(item.value.type) || 'outliner/empty'" class="shrink-0" />
		<MxContextMenu :items="contextMenuItems">
			<template #trigger>
				<span class="overflow-hidden text-ellipsis whitespace-nowrap grow">
					{{ item.value.name }}
				</span>
			</template>
		</MxContextMenu>
		<div class="contents" @click.stop>
			<CheckboxRoot v-model="visibility" class="ml-auto">
				<MxIcon :name="item.value.visible ? 'misc/visibility-visible' : 'misc/visibility-hidden'" />
			</CheckboxRoot>
		</div>
	</li>
</template>

<script lang="ts" setup>
import type { MxContextMenuItem } from '@/components/utils/MxContextMenu.vue'
import { useThreeStore } from '@/store/three'
import type { FlattenedItem } from 'reka-ui'
import { computed } from 'vue'

const visibility = defineModel<boolean>('visibility')

const props = defineProps<{
	item: FlattenedItem<OutlinerItem>
	isExpanded: boolean
	isSelected: boolean
}>()

function getPadding(level: number) {
	if (level === 0) return '0'
	return `${level * 1.5}em`
}

const threeStore = useThreeStore()

const contextMenuItems = computed<MxContextMenuItem[]>(() => {
	const groups = threeStore.sceneChildren
		.filter((item) => {
			const isGroup = item.type === 'Group'
			const isHelper = item.userData.isHelper
			return isGroup && !isHelper
		})
		.map((item) => ({ uuid: item.uuid, name: item.name }))

	const subitems: MxContextMenuItem[] = groups.map((group) => ({
		key: group.uuid,
		label: group.name,
		onSelect() {
			threeStore.moveToGroup(props.item.value.uuid, group.uuid)
		}
	}))
	return [
		{
			key: 'movetogroup',
			label: 'Move to group',
			submenu:
				subitems.length > 0
					? subitems
					: [
							{
								key: 'newgroup',
								label: 'New group',
								onSelect() {
									const group = threeStore.addGroup()
									threeStore.moveToGroup(props.item.value.uuid, group.uuid)
								}
							}
						]
		}
	]
})

const iconMap: ReadonlyMap<string, MxIconName> = new Map([
	['PointLight', 'light/light-point'],
	['SpotLight', 'light/light-spot'],
	['DirectionalLight', 'light/light-sun'],
	['RectAreaLight', 'light/light-area'],
	['Mesh', 'mesh/mesh'],
	['Group', 'outliner/group']
])

export interface OutlinerItem {
	uuid: string
	type: string
	name: string
	visible: boolean
	userData: Record<string, unknown>
	children?: OutlinerItem[]
}
</script>
