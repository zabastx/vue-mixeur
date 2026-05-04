<template>
	<ContextMenu.Root v-bind="root" @update:open="emits('update:open', $event)">
		<ContextMenu.Trigger v-bind="trigger" as-child>
			<slot></slot>
		</ContextMenu.Trigger>
		<ContextMenu.Portal>
			<ContextMenu.Content
				v-bind="content"
				class="bg-ui-menu-bg-inner text-ui-menu-item-text text-sm *:cursor-default rounded p-1
					w-[250px]"
			>
				<template v-for="item in items" :key="item.key">
					<ContextMenu.Sub v-if="item.submenu">
						<ContextMenu.SubTrigger class="context-item">
							<MxIcon v-if="item.icon" :name="item.icon" />
							<div v-else class="w-[1em]"></div>
							<span class="truncate">{{ item.label }}</span>
							<MxIcon name="base/triangle-right" class="ml-auto text-[0.8em]" />
						</ContextMenu.SubTrigger>

						<ContextMenu.SubContent
							class="bg-ui-menu-bg-inner p-1 rounded w-[250px]"
							v-bind="subContent"
						>
							<ContextMenu.Item
								v-for="subitem in item.submenu"
								:key="subitem.key"
								class="context-item"
								@select="subitem.onSelect"
							>
								<MxIcon v-if="subitem.icon" :name="subitem.icon" />
								<div v-else class="w-[1em]"></div>
								<span class="truncate">
									{{ subitem.label }}
								</span>
								<span v-if="subitem.shortcut" class="ml-auto text-[0.8em] opacity-50">{{
									subitem.shortcut
								}}</span>
								<div class="w-[1em]"></div>
							</ContextMenu.Item>
						</ContextMenu.SubContent>
					</ContextMenu.Sub>
					<ContextMenu.Item v-else class="context-item truncate" @select="item.onSelect">
						<MxIcon v-if="item.icon" :name="item.icon" />
						<div v-else class="w-[1em]"></div>
						<span class="truncate">{{ item.label }}</span>
						<span v-if="item.shortcut" class="ml-auto text-[0.8em] opacity-50">{{
							item.shortcut
						}}</span>
						<div class="w-[1em]"></div>
					</ContextMenu.Item>
				</template>
			</ContextMenu.Content>
		</ContextMenu.Portal>
	</ContextMenu.Root>
</template>

<script lang="ts" setup>
import type {
	ContextMenuContentProps,
	ContextMenuRootEmits,
	ContextMenuRootProps,
	ContextMenuSubContentProps,
	ContextMenuTriggerProps
} from 'reka-ui'
import { ContextMenu } from 'reka-ui/namespaced'

const {
	content = undefined,
	root = undefined,
	trigger = undefined,
	subContent = { alignOffset: -4 }
} = defineProps<{
	root?: ContextMenuRootProps
	trigger?: ContextMenuTriggerProps
	content?: ContextMenuContentProps
	subContent?: ContextMenuSubContentProps
	items: MxContextMenuItem[]
}>()

const emits = defineEmits<ContextMenuRootEmits>()

export interface MxContextMenuItem {
	key: string
	label: string
	icon?: MxIconName
	shortcut?: string
	submenu?: MxContextMenuItem[]
	onSelect?: (e: Event) => unknown
}
</script>

<style scoped>
@reference "tailwindcss";

.context-item {
	@apply px-1 py-0.5 flex items-center gap-1 rounded data-highlighted:text-(--color-ui-menu-item-text-selected);
	&:hover {
		@apply bg-[#3D3D3DFF];
	}
}
</style>
