<template>
	<div class="flex flex-col gap-2 p-2">
		<InputField label="Type" label-width="90px">
			<InputSelect v-model="model.type" :items="CAMERA_TYPE_OPTIONS" />
		</InputField>
		<InputField label="FOV" label-width="90px">
			<InputNumber
				v-model="model.fov"
				:format-options="{ unit: 'degree', unitDisplay: 'narrow', style: 'unit' }"
				:max="180"
				:min="1"
			/>
		</InputField>
		<InputField label="Zoom" label-width="90px">
			<InputNumber
				v-model="model.zoom"
				:step="0.1"
				:format-options="{ minimumFractionDigits: 2 }"
			/>
		</InputField>
		<button type="button" class="btn" @click="copyCameraSettings">
			Copy scene camera settings
		</button>
	</div>
</template>

<script lang="ts" setup>
import { useThreeStore } from '@/store/three'
import THREE from '@/three'
import type { InputSelectOption } from '../input/InputSelect.vue'

const model = defineModel<CameraSettings>({ required: true })

const threeStore = useThreeStore()

function copyCameraSettings() {
	const camera = threeStore.activeCamera

	model.value.zoom = camera.zoom

	if (camera instanceof THREE.PerspectiveCamera) {
		model.value.fov = camera.fov
	}
}

const CAMERA_TYPE_OPTIONS = [
	{
		label: 'Perspective',
		value: 'PerspectiveCamera'
	},
	{
		label: 'Orthographic',
		value: 'OrthographicCamera'
	}
] as const satisfies InputSelectOption[]

export interface CameraSettings {
	fov: number
	zoom: number
	type: 'PerspectiveCamera' | 'OrthographicCamera'
}
</script>
