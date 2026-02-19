<template>
	<div class="flex flex-col gap-2 p-2">
		<InputField label="Preset" label-width="90px">
			<InputSelect v-model="settings.preset" :items="resolutionOptions" />
		</InputField>

		<template v-if="settings.preset === 'custom'">
			<InputField label="Width" label-width="90px">
				<InputNumber
					v-model="model.width"
					:min="100"
					:max="8192"
					:format-options="{ maximumFractionDigits: 0 }"
				/>
			</InputField>
			<InputField label="Height" label-width="90px">
				<InputNumber
					v-model="model.height"
					:min="100"
					:max="8192"
					:format-options="{ maximumFractionDigits: 0 }"
				/>
			</InputField>
		</template>

		<InputField label="Format" label-width="90px">
			<InputSelect v-model="model.selectedFormat" :items="FORMAT_PRESETS" />
		</InputField>

		<InputField v-if="model.selectedFormat !== 'png'" label="Quality" label-width="90px">
			<div class="flex items-center gap-2">
				<MxSlider v-model="qualityValue" :root="{ min: 0, max: 100, step: 1 }" />
				<span class="text-xs w-9">{{ model.quality }}%</span>
			</div>
		</InputField>
		<InputField v-if="model.selectedFormat !== 'jpeg'" label="Background" label-width="90px">
			<InputCheckbox v-model="model.background" />
		</InputField>
	</div>
</template>

<script lang="ts" setup>
import { computed, reactive, watch } from 'vue'
import type { InputSelectOption } from '../input/InputSelect.vue'

const RESOLUTION_PRESETS = [
	{ value: '480p', label: '480p (854x480)', width: 854, height: 480 },
	{ value: '720p', label: '720p (1280x720)', width: 1280, height: 720 },
	{ value: '1080p', label: '1080p (1920x1080)', width: 1920, height: 1080 },
	{ value: '1440p', label: '1440p (2560x1440)', width: 2560, height: 1440 },
	{ value: '4k', label: '4K (3840x2160)', width: 3840, height: 2160 },
	{ value: 'custom', label: 'Custom' }
] as const

const resolutionOptions = RESOLUTION_PRESETS.map(({ label, value }) => ({ label, value }))

const FORMAT_PRESETS = [
	{ value: 'png', label: 'PNG' },
	{ value: 'jpeg', label: 'JPEG' },
	{ value: 'webp', label: 'WebP' }
] as const satisfies InputSelectOption[]

type RenderPreset = (typeof RESOLUTION_PRESETS)[number]
type FormatPreset = (typeof FORMAT_PRESETS)[number]

const model = defineModel<RenderSettings>({ required: true })

const settings = reactive<{
	preset: RenderPreset['value']
}>({
	preset: '1080p'
})

watch(
	() => settings.preset,
	(newPreset) => {
		const data = RESOLUTION_PRESETS.find(({ value }) => value === newPreset)
		if (!data) return
		if (data.value !== 'custom') {
			const { width, height } = data
			model.value.width = width
			model.value.height = height
		}
	},
	{ immediate: true }
)

watch(
	() => model.value.selectedFormat,
	(val) => {
		if (val === 'jpeg') model.value.background = true
	}
)

const qualityValue = computed({
	get: () => [model.value.quality],
	set: (val) => (model.value.quality = val[0] ?? 100)
})

export interface RenderSettings {
	width: number
	height: number
	selectedFormat: FormatPreset['value']
	quality: number
	background: boolean
}
</script>
