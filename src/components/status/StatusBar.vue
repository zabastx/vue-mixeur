<template>
	<footer
		class="bg-[#181818B3] px-2 py-1 text-xs text-[#888888] flex justify-end items-center gap-1 h-6"
	>
		<KeymapInformation class="mr-auto" />
		<!-- <div class="divider w-[1px] h-full bg-[#888888]"></div> -->
		<div class="version">{{ version }}</div>
	</footer>
</template>

<script lang="ts" setup>
import { version } from '@/../package.json'
import KeymapInformation from './KeymapInformation.vue'
</script>
