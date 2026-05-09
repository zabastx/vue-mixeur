<template>
	<div
		class="flex gap-0.5 items-center border-ui-text-outline bg-ui-text-inner rounded-ui-text border
			px-1 py-0.5 text-ui-text-text focus-within:bg-ui-text-inner-selected
			focus-within:text-ui-text-text-selected"
	>
		<MxIcon v-if="icon" :name="icon" />
		<input :id="inputId" v-model="model" :type :placeholder :inputmode class="grow outline-none" />
	</div>
</template>

<script lang="ts" setup>
import type { HTMLAttributes, InputTypeHTMLAttribute } from 'vue'

const { type = 'text' } = defineProps<{
	icon?: MxIconName
	placeholder?: string
	inputmode?: HTMLAttributes['inputmode']
	type?: InputTypeHTMLAttribute
	inputId?: string
}>()

const model = defineModel<string>()
</script>
