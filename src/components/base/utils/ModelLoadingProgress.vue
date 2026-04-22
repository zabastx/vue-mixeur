<template>
	<div
		v-if="progressStore.progressItems.length > 0"
		class="fixed bottom-16 left-4 z-50 w-sm space-y-2"
		data-testid="loading-progress"
	>
		<div
			v-for="item in progressStore.progressItems"
			:key="item.id"
			class="rounded-lg border border-ui-menu-bg-outline bg-panel-background p-4 text-white
				shadow-lg"
		>
			<div class="mb-2 flex items-center justify-between">
				<h3 class="truncate text-sm font-medium">Loading...</h3>
			</div>

			<div class="mb-2 h-2 w-full rounded-full bg-ui-number-inner">
				<div
					v-if="item.total"
					class="h-2 rounded-full bg-ui-radio-inner-selected transition-all duration-200"
					:style="{ width: `${item.percentage}%` }"
				></div>
				<div v-else class="loader h-2 rounded-full bg-ui-radio-inner-selected"></div>
			</div>

			<div class="mb-2 flex items-center justify-between">
				<h3 class="truncate text-sm font-medium">{{ item.title }}</h3>
				<span v-if="item.percentage" class="text-xs opacity-70">
					{{ Math.round(item.percentage) }}%
				</span>
			</div>

			<div v-if="item.total" class="flex justify-between text-xs opacity-70">
				<span>{{ bytesToSize(item.loaded) }} / {{ bytesToSize(item.total) }}</span>
				<span v-if="item.estimatedTimeRemaining">
					{{ formatTime(item.estimatedTimeRemaining) }}
				</span>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { useProgressStore } from '@/store/progress'
import { bytesToSize } from '@/utils/format'

const progressStore = useProgressStore()

function formatTime(milliseconds: number): string {
	const seconds = Math.ceil(milliseconds / 1000)
	if (seconds < 60) {
		return `${seconds}s remaining`
	}
	const minutes = Math.floor(seconds / 60)
	const remainingSeconds = seconds % 60
	return `${minutes}m ${remainingSeconds}s remaining`
}
</script>

<style scoped>
.loader {
	--c: no-repeat linear-gradient(var(--color-ui-radio-inner-selected) 0 0);
	background: var(--c), var(--c);
	background-size: 60% 100%;
	animation: l16 5s infinite;
}
@keyframes l16 {
	0% {
		background-position:
			-150% 0,
			-150% 0;
	}
	66% {
		background-position:
			250% 0,
			-150% 0;
	}
	100% {
		background-position:
			250% 0,
			250% 0;
	}
}
</style>
