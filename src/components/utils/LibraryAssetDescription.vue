<template>
	<img :src="asset.thumbnail_url" :alt="asset.name" class="block mx-2 h-40 object-contain" />
	<div>{{ asset.name }}</div>
	<div v-if="authors">
		<b>Authors: </b>
		<template v-for="author in authors" :key="author.name">
			<a
				v-if="author.link"
				:href="author.link"
				class="hover:underline text-blue-500"
				target="_blank"
				rel="author external"
			>
				{{ author.name }}
			</a>
			<template v-else>{{ author.name }}</template>
			({{ author.responsibility }}) <br />
		</template>
	</div>
	<div v-if="asset.description"><b>Description:</b> {{ asset.description }}</div>
	<div><b>Categories:</b> {{ asset.categories.join(', ') }}</div>
	<div><b>Tags:</b> {{ asset.tags.join(', ') }}</div>
</template>

<script lang="ts" setup>
import type { AssetAuthorInfo, AssetWithId } from '@/composables/types/polyhaven'

defineProps<{
	asset: AssetWithId
	authors?: (AssetAuthorInfo & {
		responsibility: string
	})[]
}>()
</script>

<style scoped></style>
