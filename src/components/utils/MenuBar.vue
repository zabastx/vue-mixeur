<template>
	<Menubar.Root loop>
		<Menubar.Menu v-for="menu in items" :key="menu.label">
			<Menubar.Trigger class="trigger">
				<img
					v-if="menu.icon === 'mixeur'"
					src="/favicon.svg"
					alt=""
					class="inline-block size-[1em] scale-150"
				/>
				<MxIcon v-else-if="menu.icon" :name="menu.icon" />
				<span v-else>{{ menu.label }}</span>
			</Menubar.Trigger>
			<Menubar.Content class="menubar-content">
				<template v-for="item in menu.items" :key="item.key">
					<Menubar.Item v-if="item.type === 'item'" class="item" @click="item.onClick">
						<span class="w-[1em]">
							<MxIcon v-if="item.icon" :name="item.icon" />
						</span>
						{{ item.label }}
					</Menubar.Item>
					<Menubar.CheckboxItem
						v-else-if="item.type === 'checkbox'"
						v-model="item.model.value"
						class="item"
					>
						<MxIcon v-if="item.model.value" name="ui/checkbox-checked" />
						<MxIcon v-else name="ui/checkbox-unchecked" />
						{{ item.label }}
					</Menubar.CheckboxItem>
					<Menubar.Sub v-else-if="item.type === 'sub'">
						<Menubar.SubTrigger class="item">
							<span class="w-[1em]">
								<MxIcon v-if="item.icon" :name="item.icon" />
							</span>
							{{ item.label }}
							<MxIcon name="base/triangle-right" class="ml-auto text-[0.7em]" />
						</Menubar.SubTrigger>
						<Menubar.SubContent :align-offset="-3" class="menubar-content">
							<Menubar.Item
								v-for="subitem in item.items"
								:key="subitem.key"
								class="item"
								@click="subitem.onClick"
							>
								<span class="w-[1em]">
									<MxIcon v-if="subitem.icon" :name="subitem.icon" />
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
import type { ComputedRef, Ref } from 'vue'

const { items } = defineProps<{
	items: IMenubarMenu[]
}>()

export interface IMenubarMenu {
	icon?: MxIconName | 'mixeur'
	label: string
	items: (IMenubarItem | IMenubarCheckbox | IMenubarSub | { type: 'separator'; key: string })[]
}

interface IMenubarItem extends IMenubarCommon {
	type: 'item'
	icon?: MxIconName
	onClick: () => void | Promise<void>
}

interface IMenubarCheckbox extends IMenubarCommon {
	type: 'checkbox'
	model: Ref<boolean> | ComputedRef<boolean>
}

interface IMenubarSub extends IMenubarCommon {
	type: 'sub'
	icon?: MxIconName
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
