<template>
	<div class="block-border flex flex-col overflow-hidden rounded bg-(--color-window-bg)">
		<h2 class="flex items-center gap-1 p-1 leading-0"><IconProperties /> Properties</h2>
		<Tabs.Root
			class="grid w-full grow grid-cols-[min-content_1fr] grid-rows-1 overflow-hidden"
			orientation="vertical"
			default-value="object"
			:unmount-on-hide="false"
		>
			<Tabs.List class="relative flex flex-col gap-0.5 bg-[#1D1D1DFF] pt-1 pl-1">
				<Tabs.Trigger
					v-for="item in tabsItems"
					:key="item.value"
					:value="item.value"
					class="cursor-pointer rounded-l-sm p-1 text-lg hover:bg-[#30303088] data-[state='active']:bg-(--color-window-bg)"
					:title="item.title"
				>
					<component :is="item.icon" />
				</Tabs.Trigger>
			</Tabs.List>
			<Tabs.Content
				v-for="item in tabsItems"
				:key="item.value"
				:value="item.value"
				class="scrollbar-thin overflow-auto"
			>
				<component :is="item.content" />
			</Tabs.Content>
		</Tabs.Root>
	</div>
</template>

<script lang="ts" setup>
import IconObjectData from '@/components/icons/IconObjectData.vue'
import ObjectProperties from './object/ObjectProperties.vue'
import MaterialProperties from './MaterialProperties.vue'
import IconMaterialData from '@/components/icons/IconMaterialData.vue'
import { Tabs } from 'reka-ui/namespaced'

const tabsItems = [
	{
		icon: IconObjectData,
		value: 'object',
		content: ObjectProperties,
		title: 'Object Properties'
	},
	{
		icon: IconMaterialData,
		value: 'material',
		content: MaterialProperties,
		title: 'Material Properties'
	}
]
</script>
