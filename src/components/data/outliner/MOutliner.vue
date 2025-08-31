<template>
	<div class="rounded bg-(--window-bg) overflow-auto">
		<div class="py-1 px-2.5">Scene Collection</div>
		<ul>
			<li
				v-for="(item, idx) in collection"
				:key="item.id"
				:class="idx % 2 ? 'bg-(--window-bg)' : ''"
			>
				{{ item.type }}
			</li>
		</ul>
	</div>
</template>

<script lang="ts" setup>
import { useSceneStore } from '@/store/scene'
import { computed } from 'vue'

const sceneStore = useSceneStore()

const collection = computed(() => {
	if (sceneStore.getScene.value) {
		return sceneStore.getScene.value.children
	}
	return []
})
</script>
