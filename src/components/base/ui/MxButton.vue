<template>
	<MxTooltip :tooltip :tooltip-disabled="!tooltip">
		<button
			v-bind="$attrs"
			:type
			:disabled
			class="text-ui-btn-text bg-ui-btn-bg border-ui-btn-outline rounded-ui-btn hover:brightness-125
				cursor-pointer border px-1 inline-flex gap-1"
			:class="{ 'bg-ui-btn-bg-highlight': highlighted }"
		>
			<MxIcon v-if="icon" :name="icon" class="grow-0" />
			<div class="mx-auto">
				<slot></slot>
			</div>
		</button>
	</MxTooltip>
</template>

<script lang="ts" setup>
import type { ButtonHTMLAttributes } from 'vue'
import type { MxTooltipContent } from './MxTooltip.vue'
import MxIcon from './MxIcon.vue'

defineOptions({
	inheritAttrs: false
})

const { type = 'button' } = defineProps<MxButtonProps>()

type MxButtonProps = {
	type?: ButtonHTMLAttributes['type']
	highlighted?: boolean
	disabled?: ButtonHTMLAttributes['disabled']
	tooltip?: MxTooltipContent
	icon?: MxIconName
}
</script>
