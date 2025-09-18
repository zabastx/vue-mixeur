<template>
	<div class="text-xl rounded block-border flex flex-col bg-(--color-window-bg)">
		<div class="text-sm flex items-center p-1">
			<IconCollection class="text-xl" /> Scene Collection
		</div>
		<div class="bg-stripes overflow-auto grow">
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
