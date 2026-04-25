<template>
	<ContextMenu.Root v-bind="root">
		<ContextMenu.Trigger v-bind="trigger" as-child>
			<slot></slot>
		</ContextMenu.Trigger>
		<ContextMenu.Portal>
			<ContextMenu.Content
				v-bind="content"
				class="bg-ui-menu-bg-inner text-ui-menu-bg-text text-sm *:cursor-default rounded p-1
					min-w-[150px]"
			>
				<template v-for="item in items" :key="item.key">
					<ContextMenu.Sub v-if="item.submenu">
						<ContextMenu.SubTrigger class="context-item">
							<MxIcon v-if="item.icon" :name="item.icon" />
							<div v-else class="size-[1em]"></div>
							<span>{{ item.label }}</span>
							<MxIcon name="base/triangle-right" class="ml-auto text-[0.8em]" />
						</ContextMenu.SubTrigger>

						<ContextMenu.SubContent
							class="bg-ui-menu-bg-inner p-1 rounded min-w-[150px]"
							v-bind="subContent"
						>
							<ContextMenu.Item
								v-for="subitem in item.submenu"
								:key="subitem.key"
								class="context-item"
								@select="subitem.onSelect"
							>
								<MxIcon v-if="subitem.icon" :name="subitem.icon" />
								<div v-else class="size-[1em]"></div>
								<span>
									{{ subitem.label }}
								</span>
								<div class="size-[1em]"></div>
							</ContextMenu.Item>
						</ContextMenu.SubContent>
					</ContextMenu.Sub>
					<ContextMenu.Item v-else class="context-item" @select="item.onSelect">
						<MxIcon v-if="item.icon" :name="item.icon" />
						<div v-else class="size-[1em]"></div>
						<span>{{ item.label }}</span>
						<div class="size-[1em]"></div>
					</ContextMenu.Item>
				</template>
			</ContextMenu.Content>
		</ContextMenu.Portal>
	</ContextMenu.Root>
</template>

<script lang="ts" setup>
import type {
	ContextMenuContentProps,
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

export interface MxContextMenuItem {
	key: string
	label: string
	icon?: MxIconName
	submenu?: MxContextMenuItem[]
	onSelect?: (e: Event) => unknown
}
</script>

<style scoped>
@reference "tailwindcss";

.context-item {
	@apply px-2 pr-1 flex items-center gap-1 rounded data-highlighted:text-(--color-ui-menu-item-text-selected);
	&:hover {
		@apply bg-[#3D3D3DFF];
	}
}
</style>
