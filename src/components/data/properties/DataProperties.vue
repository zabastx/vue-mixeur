<template>
	<div ref="css" class="block-border flex flex-col overflow-hidden rounded bg-(--color-window-bg)">
		<h2 class="p-1">Properties</h2>
		<TabsRoot
			class="grid w-full grow grid-cols-[min-content_1fr] grid-rows-1 overflow-hidden"
			orientation="vertical"
			default-value="object"
			:unmount-on-hide="false"
		>
			<TabsList class="relative flex flex-col bg-[#1D1D1DFF] pt-1 pl-1">
				<TabsTrigger
					v-for="item in tabsItems"
					:key="item.value"
					:value="item.value"
					class="cursor-pointer rounded-l-sm p-1 text-lg hover:bg-[#30303088] data-[state='active']:bg-(--color-window-bg)"
					:title="item.title"
				>
					<component :is="item.icon" />
				</TabsTrigger>
			</TabsList>
			<TabsContent
				v-for="item in tabsItems"
				:key="item.value"
				:value="item.value"
				class="scrollbar-thin overflow-auto"
			>
				<component :is="item.content" />
			</TabsContent>
		</TabsRoot>
	</div>
</template>

<script lang="ts" setup>
import IconObjectData from '@/components/icons/IconObjectData.vue'
import ObjectProperties from './object/ObjectProperties.vue'
import MaterialProperties from './MaterialProperties.vue'
import IconMaterialData from '@/components/icons/IconMaterialData.vue'

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
