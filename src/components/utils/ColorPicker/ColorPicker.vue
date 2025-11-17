<template>
	<div class="flex flex-col gap-2">
		<div ref="pickerRef"></div>
		<RadioGroupRoot
			v-model="colorType"
			class="rounded overflow-hidden grid grid-cols-2 text-xs text-ui-radio-text"
		>
			<RadioGroupItem
				v-for="item in ['RGB', 'HSV']"
				:key="item"
				:value="item"
				class="bg-ui-radio-inner data-[state='checked']:bg-ui-radio-inner-selected
					data-[state='checked']:text-ui-radio-text-selected p-0.5"
			>
				{{ item }}
			</RadioGroupItem>
		</RadioGroupRoot>
		<template v-if="picker">
			<ColorPickerHsv v-if="colorType === 'HSV'" v-model="picker.color.hsva" />
			<ColorPickerRgb v-if="colorType === 'RGB'" v-model="picker.color.rgba" />
			<div class="flex items-center justify-between text-ui-menu-bg-text gap-2 text-xs">
				<span>Hex</span>
				<input type="text" class="input w-[100px]" :value="hexString" @change="onHexChange" />
				<button
					v-if="isEyeDropperSupported"
					type="button"
					class="btn text-[1.25em] p-0.5"
					@click="handleEyeDropper"
				>
					<IconEyeDropper />
				</button>
			</div>
		</template>
	</div>
</template>

<script lang="ts" setup>
import { useToast } from '@/composables/useToast'
import iro from '@jaames/iro'
import type { ColorPickerProps } from '@jaames/iro/dist/ColorPicker'
import { useEyeDropper } from '@vueuse/core'
import { computed, onMounted, ref, triggerRef, useTemplateRef, watch } from 'vue'

const model = defineModel<string>({ required: true })
const modelAlpha = defineModel<number>('alpha')
const pickerRef = useTemplateRef('pickerRef')
const picker = ref<iro.ColorPicker>()
const colorType = ref<'RGB' | 'HSV'>('RGB')

const { toast } = useToast()

const hexString = computed({
	set(v: string) {
		if (!picker.value) return
		try {
			picker.value.color.hex8String = v
		} catch (e) {
			const err = e as Error
			toast.error(err.message)
		}
	},
	get() {
		if (picker.value) {
			return picker.value.color.hex8String
		} else {
			return '#fff'
		}
	}
})

watch(
	picker,
	(val) => {
		if (val) {
			model.value = val.color.hexString
			modelAlpha.value = val.color.alpha
		}
	},
	{ deep: true }
)

function onHexChange(e: Event) {
	const target = e.target as HTMLInputElement
	hexString.value = target.value
}

onMounted(() => {
	if (!pickerRef.value) return
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	picker.value = new (iro.ColorPicker as any)(pickerRef.value, {
		color: model.value,
		layoutDirection: 'horizontal',
		width: 150,
		sliderSize: 10,
		padding: 0,
		layout: [
			{
				component: iro.ui.Wheel
			},
			{
				component: iro.ui.Slider,
				options: {
					sliderType: 'value'
				}
			}
		]
	} as ColorPickerProps)
	picker.value?.on('color:change', () => {
		triggerRef(picker)
	})
})

const { isSupported: isEyeDropperSupported, open: openEyeDropper } = useEyeDropper()

function handleEyeDropper() {
	openEyeDropper()
		.then((color) => {
			if (!color) return
			hexString.value = color.sRGBHex
		})
		.catch(() => {})
}
</script>
