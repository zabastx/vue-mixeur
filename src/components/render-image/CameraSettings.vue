<template>
	<div class="flex flex-col gap-1 p-2">
		<InputField label="Camera" label-width="100px">
			<InputSelect
				:items="renderCameraOptions"
				:model-value="renderCamera?.uuid"
				@update:model-value="onCameraChange"
			/>
		</InputField>
		<template v-if="renderCamera">
			<InputField v-if="'fov' in renderCamera" label="FOV" label-width="100px">
				<InputNumber
					v-model="renderCamera.fov"
					:format-options="{ unit: 'degree', unitDisplay: 'narrow', style: 'unit' }"
					:max="180"
					:min="1"
				/>
			</InputField>
			<InputField label="Clip Start" label-width="100px">
				<InputNumber
					v-model="renderCamera.near"
					:step="1"
					:format-options="{ minimumFractionDigits: 1 }"
				/>
			</InputField>
			<InputField label="Clip End" label-width="100px">
				<InputNumber
					v-model="renderCamera.far"
					:step="1"
					:format-options="{ minimumFractionDigits: 1 }"
				/>
			</InputField>
			<InputField label="Zoom" label-width="100px">
				<InputNumber
					v-model="renderCamera.zoom"
					:step="0.1"
					:format-options="{ minimumFractionDigits: 2 }"
				/>
			</InputField>
		</template>
	</div>
</template>

<script lang="ts" setup>
import { useCameraStore } from '@/store/camera'
import THREE from '@/three'
import { computed } from 'vue'

const cameraStore = useCameraStore()

const renderCamera = computed(() => {
	if (cameraStore.renderCamera instanceof THREE.PerspectiveCamera) return cameraStore.renderCamera
	if (cameraStore.renderCamera instanceof THREE.OrthographicCamera) return cameraStore.renderCamera
	return null
})

const renderCameraOptions = computed(() =>
	cameraStore.renderCameraList.map((cam) => ({
		value: cam.uuid,
		label: cam.name
	}))
)

function onCameraChange(uuid?: string) {
	if (!uuid) return
	cameraStore.setRenderCamera(uuid)
}
</script>
