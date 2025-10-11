<template>
	<div v-if="activeLoadings.length > 0" class="fixed bottom-16 left-4 z-50 space-y-2 w-sm">
		<div
			v-for="loading in activeLoadings"
			:key="loading.id"
			class="bg-[var(--color-panel-background)] text-white p-4 rounded-lg shadow-lg border border-[var(--color-editor-border)]"
		>
			<div class="flex items-center justify-between mb-2">
				<h3 class="text-sm font-medium truncate">{{ loading.filename }}</h3>
				<span class="text-xs opacity-70">{{ Math.round(loading.percentage) }}%</span>
			</div>

			<div class="w-full bg-[var(--color-ui-number-field-inner)] rounded-full h-2 mb-2">
				<div
					class="bg-[var(--color-ui-radio-button-selected)] h-2 rounded-full transition-all duration-300 ease-out"
					:style="{ width: `${loading.percentage}%` }"
				></div>
			</div>

			<div class="flex justify-between text-xs opacity-70">
				<span>{{ formatBytes(loading.loaded) }} / {{ formatBytes(loading.total) }}</span>
				<span v-if="loading.estimatedTimeRemaining">{{
					formatTime(loading.estimatedTimeRemaining)
				}}</span>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useProgressStore } from '@/store/progress'

const progressStore = useProgressStore()

const activeLoadings = computed(() => progressStore.getActiveLoadings())

function formatBytes(bytes: number): string {
	if (bytes === 0) return '0 B'
	const k = 1024
	const sizes = ['B', 'KB', 'MB', 'GB']
	const i = Math.floor(Math.log(bytes) / Math.log(k))
	return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
}

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
