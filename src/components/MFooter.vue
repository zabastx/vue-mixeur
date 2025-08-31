<template>
	<footer
		class="bg-[#181818B3] px-2 py-1 text-xs text-[#888888] flex justify-end items-center gap-1"
	>
		<div class="hints mr-auto text-xl flex items-center">
			<IconLMB />
			<span class="text-xs">Select</span>
			<IconMMB />
			<span class="text-xs">Rotate View</span>
		</div>
		<!-- <div class="divider w-[1px] h-full bg-[#888888]"></div> -->
		<div class="version">{{ version }}</div>
	</footer>
</template>

<script lang="ts" setup>
import { version } from '@/../package.json'
import IconLMB from './icons/IconLMB.vue'
import IconMMB from './icons/IconMMB.vue'
</script>
