<template>
	<ContextMenu.Root v-bind="root">
		<ContextMenu.Trigger as-child v-bind="trigger">
			<slot name="trigger"></slot>
		</ContextMenu.Trigger>
		<ContextMenu.Portal>
			<ContextMenu.Content
				v-bind="content"
				class="bg-ui-menu-bg-inner text-ui-menu-bg-text text-sm *:cursor-default rounded p-1"
			>
				<template v-for="item in items" :key="item.key">
					<ContextMenu.Sub v-if="item.submenu">
						<ContextMenu.SubTrigger class="context-item flex items-center gap-2">
							{{ item.label }}
							<MxIcon name="base/triangle-right" class="ml-auto text-[0.8em]" />
						</ContextMenu.SubTrigger>

						<ContextMenu.SubContent class="bg-ui-menu-bg-inner p-1 rounded" v-bind="subContent">
							<ContextMenu.Item
								v-for="subitem in item.submenu"
								:key="subitem.key"
								class="context-item"
								@select="subitem.onSelect"
							>
								{{ subitem.label }}
							</ContextMenu.Item>
						</ContextMenu.SubContent>
					</ContextMenu.Sub>
					<ContextMenu.Item v-else class="context-item" @select="item.onSelect">
						{{ item.label }}
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
	submenu?: MxContextMenuItem[]
	onSelect?: (e: Event) => unknown
}
</script>

<style scoped>
@reference "tailwindcss";

.context-item {
	@apply px-2 pr-1 rounded;
	&:hover {
		@apply bg-[#3D3D3DFF];
	}
}
</style>
