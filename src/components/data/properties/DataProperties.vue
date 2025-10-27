<template>
	<div class="block-border flex flex-col overflow-hidden rounded bg-window-bg">
		<h2 class="flex items-center gap-1 p-1 leading-0"><IconProperties /> Properties</h2>
		<Tabs.Root
			v-model="activetab"
			class="grid w-full grow grid-cols-[min-content_1fr] grid-rows-1 overflow-hidden"
			orientation="vertical"
			default-value="object"
			:unmount-on-hide="false"
		>
			<Tabs.List class="relative flex flex-col gap-0.5 bg-ui-tab-inner pt-1 pl-1">
				<Tabs.Trigger
					v-for="item in tabs"
					:key="item.value"
					:value="item.value"
					class="cursor-pointer rounded-l-sm p-1 text-lg hover:bg-ui-tab-inner-selected
						data-[state='active']:bg-ui-tab-inner-selected"
					:title="item.title"
				>
					<component :is="item.icon" class="m-auto" />
				</Tabs.Trigger>
			</Tabs.List>
			<ScrollContainer>
				<Tabs.Content v-for="item in tabs" :key="item.value" :value="item.value" class="p-1">
					<component :is="item.content" />
				</Tabs.Content>
			</ScrollContainer>
		</Tabs.Root>
	</div>
</template>

<script lang="ts" setup>
import IconObjectData from '@/components/icons/IconObjectData.vue'
import ObjectProperties from './object/ObjectProperties.vue'
import { Tabs } from 'reka-ui/namespaced'
import { computed, ref, watch, type Component } from 'vue'
import { useThreeStore } from '@/store/three'
import THREE from '@/three'
import LightDataProperties from './data/LightDataProperties.vue'
import IconLightProperties from '@/components/icons/properties/IconLightProperties.vue'
import { TextGeometry } from 'three/examples/jsm/Addons.js'
import IconTextProperties from '@/components/icons/properties/IconTextProperties.vue'
import TextDataProperties from './data/TextDataProperties.vue'

const store = useThreeStore()

const activetab = ref('object')

watch(
	() => store.selectedObject,
	() => {
		if (store.selectedObject) {
			activetab.value = 'object'
		}
	}
)

const tabs = computed<DataTabItem[]>(() => {
	const obj = store.selectedObject
	if (!obj) return []
	const list: DataTabItem[] = [
		{
			icon: IconObjectData,
			value: 'object',
			content: ObjectProperties,
			title: 'Object Properties'
		}
	]
	if (obj instanceof THREE.Light) {
		list.push({
			icon: IconLightProperties,
			content: LightDataProperties,
			title: 'Light Properties',
			value: 'light'
		})
	}
	if (obj instanceof THREE.Mesh) {
		if (obj.geometry instanceof TextGeometry) {
			list.push({
				icon: IconTextProperties,
				value: 'textdata',
				content: TextDataProperties,
				title: 'Text Properties'
			})
		}

		// if (isThreeGeometry(obj.geometry)) {
		// 	list.push({
		// 		icon: IconGeometryProperties,
		// 		value: 'geometry',
		// 		content: GeometryProperties,
		// 		title: 'Geometry Properties'
		// 	})
		// }

		// if ('material' in obj) {
		// 	list.push({
		// 		icon: IconMaterialData,
		// 		value: 'material',
		// 		content: MaterialProperties,
		// 		title: 'Material Properties'
		// 	})
		// }
	}
	return list
})

interface DataTabItem {
	icon: Component
	value: string
	content: Component
	title: string
}
</script>
