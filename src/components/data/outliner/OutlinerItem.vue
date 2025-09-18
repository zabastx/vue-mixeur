<template>
	<details v-if="hasChildren" class="pl-5">
		<summary>{{ item.name || item.type }}</summary>
		<OutlinerItem v-for="child in item.children" :key="child.id" class="pl-5" :item="child" />
	</details>
	<div v-else class="pl-5">{{ item.name || item.type }}</div>
</template>

<script lang="ts" setup>
import type { Object3D, Object3DEventMap } from 'three'
import { computed } from 'vue'

const { item } = defineProps<{
	item: Object3D<Object3DEventMap>
}>()

const hasChildren = computed(() => item.children.length > 0)
</script>
