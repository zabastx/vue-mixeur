<template>
	<div class="text-xl rounded overflow-auto px-1 bg-stripes block-border">
		<div class="text-sm flex items-center"><IconCollection class="text-xl" /> Scene Collection</div>
		<!-- <OutlinerItem
			v-for="item in sceneStore.sceneObjects"
			:key="item.id"
			class="text-sm"
			:item="item"
		/> -->
	</div>
</template>

<script lang="ts" setup>
import IconCollection from '@/components/icons/IconCollection.vue'
</script>
