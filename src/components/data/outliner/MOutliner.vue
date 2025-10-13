<template>
	<div class="block-border flex flex-col rounded bg-(--color-window-bg) text-xl">
		<div class="flex items-center p-1 text-sm">
			<IconCollection class="text-xl" /> Scene Collection
		</div>
		<div class="bg-stripes grow overflow-auto">
			<OutlinerItem
				v-for="item in sceneStore.sceneObjects"
				:key="item.id"
				class="text-sm"
				:item="item"
			/>
		</div>
	</div>
</template>

<script lang="ts" setup>
import IconCollection from '@/components/icons/IconCollection.vue'
import { useThreeStore } from '@/store/three'

const sceneStore = useThreeStore()
</script>
