<template>
	<MxContextMenu :items="contextMenuItems">
		<div
			:style="{ paddingLeft: getPadding(item.level) }"
			class="relative flex snap-start items-center gap-1 pr-5 hover:bg-outliner-active-highlight
				group"
			:class="{
				'bg-outliner-active-highlight text-outliner-active-object': isSelected
			}"
			data-testid="outliner-item"
		>
			<button
				v-if="item.hasChildren"
				type="button"
				data-toggle
				class="text-base p-0.5 inline-flex items-center justify-center cursor-pointer
					hover:brightness-125 size-4"
			>
				<MxIcon :name="isExpanded ? 'ui/arrow-down' : 'ui/arrow-right'" />
			</button>

			<div v-if="item.value.isCamera" class="flex gap-1 items-center">
				<MxIcon name="outliner/camera-obj" class="shrink-0 text-icon-object text-base" />
				<span class="truncate grow">
					{{ item.value.name }}
				</span>
				<button
					type="button"
					class="p-0.5 hover:brightness-125 rounded border-ui-radio-outline cursor-pointer ml-5"
					:class="{
						'border bg-ui-radio-inner': cameraStore.renderCamera?.uuid === item.value.uuid
					}"
					@click.stop="cameraStore.setRenderCamera(item.value.uuid)"
				>
					<MxIcon name="outliner/camera" class="shrink-0 text-icon-object-data text-base" />
				</button>
			</div>

			<template v-else>
				<MxIcon
					:name="iconMap.get(item.value.type) || 'outliner/empty'"
					class="shrink-0 text-icon-object text-base"
				/>
				<span class="truncate grow">
					{{ item.value.name }}
				</span>
			</template>
			<div class="contents" @click.stop>
				<CheckboxRoot v-model="visibility" class="ml-auto">
					<MxIcon
						:name="visibility ? 'outliner/visibility-visible' : 'outliner/visibility-hidden'"
					/>
				</CheckboxRoot>
			</div>
		</div>
	</MxContextMenu>
</template>

<script lang="ts" setup>
import type { MxContextMenuItem } from '@/components/base/utils/MxContextMenu.vue'
import { useCameraStore } from '@/store/camera'
import { useThreeStore } from '@/store/three'
import type { MxObjectUserData } from '@/three/three'
import type { FlattenedItem } from 'reka-ui'
import { computed } from 'vue'

const cameraStore = useCameraStore()
const threeStore = useThreeStore()

const visibility = defineModel<boolean>('visibility')

const props = defineProps<{
	item: FlattenedItem<OutlinerItem>
	isExpanded: boolean
	isSelected: boolean
}>()

const groupOptions = computed<MxContextMenuItem[]>(() => {
	const items: MxContextMenuItem[] = threeStore.sceneGroups.map((group) => ({
		type: 'item',
		key: group.uuid,
		label: group.name,
		onSelect() {
			threeStore.moveObjectToTarget(props.item.value.uuid, group.uuid)
		}
	}))

	return items
})

const contextMenuItems = computed(() => {
	const uuid = props.item.value.uuid
	const items: MxContextMenuItem[] = [
		{
			key: 'movetogroup',
			label: 'Move to',
			submenu: [
				{
					key: 'sceneroot',
					label: 'Scene Root',
					icon: 'ui/collection',
					onSelect() {
						threeStore.moveObjectToTarget(uuid, threeStore.scene.uuid)
					}
				},
				{
					key: 'newgroup',
					label: 'New Group',
					icon: 'outliner/group-new',
					onSelect() {
						const group = threeStore.addGroup()
						threeStore.moveObjectToTarget(uuid, group.uuid)
					}
				},
				...groupOptions.value
			]
		},
		{
			key: 'duplicate',
			label: 'Duplicate Object',
			shortcut: 'Shift + D',
			onSelect() {
				threeStore.cloneObject(uuid)
			}
		},
		{
			key: 'delete',
			label: 'Delete',
			shortcut: 'Del',
			onSelect() {
				threeStore.deleteFromScene(uuid)
			}
		}
	]
	return items
})

function getPadding(level: number) {
	if (level === 0) return '0'
	return `${level * 1.25}rem`
}

const iconMap: ReadonlyMap<string, MxIconName> = new Map([
	['PointLight', 'light/light-point'],
	['SpotLight', 'light/light-spot'],
	['DirectionalLight', 'light/light-sun'],
	['RectAreaLight', 'light/light-area'],
	['Bone', 'mesh/bone'],
	['Mesh', 'mesh/mesh'],
	['Group', 'outliner/group']
])

export interface OutlinerItem {
	uuid: string
	type: string
	name: string
	userData: MxObjectUserData
	isCamera: boolean
	children?: OutlinerItem[]
}
</script>
