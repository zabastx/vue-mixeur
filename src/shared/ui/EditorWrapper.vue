<template>
	<div class="block-border overflow-hidden rounded bg-window-bg relative">
		<slot name="header">
			<template v-if="title">
				<h2 class="flex items-center gap-1 px-1 text-base">
					<MxIcon v-if="icon" :name="icon" /> <span>{{ title }}</span>
				</h2>
			</template>
		</slot>

		<slot></slot>
	</div>
</template>

<script lang="ts" setup>
defineProps<{
	title?: string
	icon?: MxIconName
}>()
</script>
