<template>
	<NumberFieldRoot v-bind="props" v-model="model" class="flex justify-end">
		<div class="group flex grow max-w-full overflow-hidden rounded-sm bg-ui-number-inner">
			<NumberFieldDecrement
				class="cursor-pointer shrink-0 grow-0 bg-ui-number-inner px-0.5 opacity-0
					group-hover:opacity-100 hover:brightness-125"
			>
				<MxIcon name="ui/arrow-right" class="rotate-180 text-[0.75em]" />
			</NumberFieldDecrement>

			<div class="relative">
				<NumberFieldInput
					ref="inputRef"
					class="grow w-full text-center outline-none group-hover:brightness-110 py-0.5 select-none
						z-1 relative focus:cursor-text"
					data-testid="number-input"
					:class="{ 'cursor-ew-resize': !disabled }"
					@pointerdown="onPointerDown"
					@focus="isInputFocused = true"
					@blur="isInputFocused = false"
				/>
				<div
					class="bg-ui-number-item h-full absolute top-0 left-0"
					:style="{ width: barFillWidth }"
				></div>
			</div>
			<NumberFieldIncrement
				class="shrink-0 grow-0 cursor-pointer bg-ui-number-inner px-0.5 opacity-0
					group-hover:opacity-100 hover:brightness-125"
			>
				<MxIcon name="ui/arrow-right" class="text-[0.75em]" />
			</NumberFieldIncrement>
		</div>
	</NumberFieldRoot>
</template>

<script lang="ts" setup>
import { useEventListener, useKeyModifier } from '@vueuse/core'
import type { NumberFieldInput, NumberFieldRootProps } from 'reka-ui'
import { computed, ref, useTemplateRef } from 'vue'

const props = withDefaults(defineProps<NumberFieldRootProps>(), {
	formatOptions: () => ({ minimumFractionDigits: 3 }),
	step: 1
})

const model = defineModel<number>({ default: 0 })

const inputRef = useTemplateRef<InstanceType<typeof NumberFieldInput>>('inputRef')

const isPointerMoved = ref(false)
const isPointerDown = ref(false)
const isInputFocused = ref(false)

const shiftState = useKeyModifier('Shift')
const controlState = useKeyModifier('Control')

const STEP_MULTIPLIER_CONTROL = 10
const STEP_MULTIPLIER_SHIFT = 0.1

function onPointerDown(e: PointerEvent) {
	if (props.disabled) return
	if (e.button !== 0) return
	isPointerDown.value = true

	if (!isInputFocused.value) {
		e.preventDefault()
		const $el = e.target as HTMLInputElement
		$el.requestPointerLock()
		return
	}
}

useEventListener('pointermove', (e: PointerEvent) => {
	if (!isPointerDown.value) return

	if (e.movementX === 0 || isInputFocused.value) return
	isPointerMoved.value = true

	let step = e.movementX > 0 ? props.step : -props.step
	if (controlState.value) step = step * STEP_MULTIPLIER_CONTROL
	if (shiftState.value) step = step * STEP_MULTIPLIER_SHIFT

	let newVal = model.value + step

	if (props.max !== undefined && newVal > props.max) newVal = props.max
	if (props.min !== undefined && newVal < props.min) newVal = props.min

	model.value = newVal
})

useEventListener('pointerup', () => {
	if (!isPointerDown.value) return

	if (inputRef.value && !isPointerMoved.value) {
		const input = inputRef.value.$el as HTMLInputElement
		input.focus()
	}

	isPointerMoved.value = false
	isPointerDown.value = false
	if (document.pointerLockElement) document.exitPointerLock()
})

const barFillWidth = computed(() => {
	if (props.max === undefined) return '0%'
	const min = props.min ?? 0
	const range = props.max - min
	if (range === 0) return '0%'
	const percentValue = ((model.value - min) / range) * 100
	return `${Math.max(0, Math.min(100, percentValue))}%`
})
</script>
