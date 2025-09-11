<template>
	<div ref="css" class="rounded bg-(--window-bg) overflow-hidden block-border flex flex-col">
		<h2 class="p-1">Properties</h2>
		<TabsRoot
			class="grid grid-cols-[min-content_1fr] grid-rows-1 w-full grow overflow-hidden"
			orientation="vertical"
			default-value="object"
			:unmount-on-hide="false"
		>
			<TabsList class="relative flex flex-col bg-[#1D1D1DFF] pl-1 pt-1">
				<TabsTrigger
					v-for="item in tabsItems"
					:key="item.value"
					:value="item.value"
					class="cursor-pointer p-1 data-[state='active']:bg-(--window-bg) rounded-l-sm text-lg hover:bg-[#30303088]"
					:title="item.title"
				>
					<component :is="item.icon" />
				</TabsTrigger>
			</TabsList>
			<TabsContent
				v-for="item in tabsItems"
				:key="item.value"
				:value="item.value"
				class="overflow-auto scrollbar-thin"
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
