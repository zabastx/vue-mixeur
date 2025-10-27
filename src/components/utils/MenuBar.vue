<template>
	<Menubar.Root loop>
		<Menubar.Menu v-for="menu in items" :key="menu.label">
			<Menubar.Trigger class="trigger">
				<component :is="menu.icon" v-if="menu.icon" />
				<span v-else>{{ menu.label }}</span>
			</Menubar.Trigger>
			<Menubar.Content class="menubar-content">
				<template v-for="item in menu.items" :key="item.key">
					<Menubar.Item v-if="item.type === 'item'" class="item" @click="item.onClick">
						<span class="w-[1em]">
							<component :is="item.icon" v-if="item.icon" />
						</span>
						{{ item.label }}
					</Menubar.Item>
					<Menubar.CheckboxItem
						v-else-if="item.type === 'checkbox'"
						v-model="item.model.value"
						class="item"
					>
						<IconCheckbox :checked="item.model.value" />
						{{ item.label }}
					</Menubar.CheckboxItem>
					<Menubar.Sub v-else-if="item.type === 'sub'">
						<Menubar.SubTrigger class="item">
							<span class="w-[1em]">
								<component :is="item.icon" v-if="item.icon" />
							</span>
							{{ item.label }}
							<IconTriangle class="ml-auto text-[0.7em]" />
						</Menubar.SubTrigger>
						<Menubar.SubContent :align-offset="-3" class="menubar-content">
							<Menubar.Item
								v-for="subitem in item.items"
								:key="subitem.key"
								class="item"
								@click="subitem.onClick"
							>
								<span class="w-[1em]">
									<component :is="subitem.icon" v-if="item.icon" />
								</span>
								{{ subitem.label }}
							</Menubar.Item>
						</Menubar.SubContent>
					</Menubar.Sub>
					<Menubar.Separator
						v-else-if="item.type === 'separator'"
						class="h-px bg-ui-menu-bg-outline"
					/>
				</template>
			</Menubar.Content>
		</Menubar.Menu>
	</Menubar.Root>
</template>

<script lang="ts" setup>
import { Menubar } from 'reka-ui/namespaced'
import type { Component, ComputedRef, Ref } from 'vue'

const { items } = defineProps<{
	items: IMenubarMenu[]
}>()

export interface IMenubarMenu {
	icon?: Component
	label: string
	items: (IMenubarItem | IMenubarCheckbox | IMenubarSub | { type: 'separator'; key: string })[]
}

interface IMenubarItem extends IMenubarCommon {
	type: 'item'
	icon?: Component
	onClick: () => void | Promise<void>
}

interface IMenubarCheckbox extends IMenubarCommon {
	type: 'checkbox'
	model: Ref<boolean> | ComputedRef<boolean>
}

interface IMenubarSub extends IMenubarCommon {
	type: 'sub'
	icon?: Component
	items: IMenubarItem[]
}

interface IMenubarCommon {
	key: string
	label: string
}
</script>

<style scoped>
@reference 'tailwindcss/theme';

.trigger {
	@apply cursor-default rounded px-2 py-1 text-sm leading-none text-(--color-ui-menu-item-text) hover:bg-[#3D3D3DFF];
	&[data-highlighted] {
		@apply text-(--color-ui-menu-item-selected);
	}
	&[data-state='open'] {
		@apply rounded-b-none bg-[#3D3D3DFF];
	}
}

.item {
	@apply flex cursor-default items-center gap-1 rounded p-1 pl-2.5 leading-none;
	&[data-highlighted] {
		@apply text-(--color-ui-menu-item-selected) data-highlighted:bg-gray-500;
	}
	& > :first-child {
		@apply text-sm;
	}
}
</style>
