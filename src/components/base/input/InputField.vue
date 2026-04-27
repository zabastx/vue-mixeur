<template>
	<div
		class="grid grid-cols-[min-content_1fr] items-start gap-x-1 relative"
		:style="{ gridTemplateColumns: gridCols }"
		:class="{ 'opacity-50': disabled }"
	>
		<MxTooltip :tooltip :tooltip-disabled="!tooltip">
			<label
				:for="id"
				class="px-1 py-0.5 leading-4 cursor-default truncate flex gap-1"
				:class="{ 'order-1': reverse }"
			>
				{{ label }}
				<MxIcon v-if="tooltip" class="align-[center]" name="misc/question" />
			</label>
		</MxTooltip>
		<slot :id :disabled></slot>
	</div>
</template>

<script lang="ts" setup>
import { computed, useId } from 'vue'
import type { MxTooltipContent } from '../ui/MxTooltip.vue'

const id = useId()

const {
	inputWidth = 'auto',
	labelWidth = 'min-content',
	tooltip = undefined
} = defineProps<{
	label: string
	inputWidth?: string
	labelWidth?: string
	reverse?: boolean
	tooltip?: MxTooltipContent
	disabled?: boolean
}>()

const gridCols = computed(() => `${labelWidth} ${inputWidth}`)
</script>
