<template>
	<div class="flex flex-col gap-1 p-2">
		<InputField label="Camera" label-width="125px">
			<InputSelect
				:items="renderCameraOptions"
				:model-value="renderCamera?.uuid"
				@update:model-value="onCameraChange"
			/>
		</InputField>
		<template v-if="renderCamera">
			<InputField v-if="'fov' in renderCamera" label="FOV" label-width="125px">
				<InputNumber
					v-model="cameraSettings.fov"
					:format-options="{ unit: 'degree', unitDisplay: 'narrow', style: 'unit' }"
					:max="180"
					:min="1"
				/>
			</InputField>
			<InputField label="Clip Start" label-width="125px">
				<InputNumber
					v-model="cameraSettings.near"
					:step="1"
					:format-options="{ minimumFractionDigits: 1 }"
				/>
			</InputField>
			<InputField label="Clip End" label-width="125px">
				<InputNumber
					v-model="cameraSettings.far"
					:step="1"
					:format-options="{ minimumFractionDigits: 1 }"
				/>
			</InputField>
			<InputField label="Zoom" label-width="125px">
				<InputNumber
					v-model="cameraSettings.zoom"
					:step="0.1"
					:format-options="{ minimumFractionDigits: 2 }"
				/>
			</InputField>
		</template>
	</div>
</template>

<script lang="ts" setup>
import { useCameraStore } from '@/app/model/camera'
import { isPerspectiveCamera } from '@/shared/lib/types'
import THREE from '@/shared/three'
import { computed, reactive, watch } from 'vue'

const cameraStore = useCameraStore()

const renderCamera = computed(() => {
	return cameraStore.renderCamera as THREE.PerspectiveCamera | THREE.OrthographicCamera | null
})

const cameraSettings = reactive({
	fov: isPerspectiveCamera(renderCamera.value) ? renderCamera.value.fov : 50,
	zoom: renderCamera.value?.zoom ?? 1,
	near: renderCamera.value?.near ?? 0.1,
	far: renderCamera.value?.far ?? 2000
})

watch(cameraSettings, ({ far, fov, near, zoom }) => {
	if (!renderCamera.value) return

	renderCamera.value.near = near
	renderCamera.value.far = far
	renderCamera.value.zoom = zoom

	if (isPerspectiveCamera(renderCamera.value)) {
		renderCamera.value.fov = fov
	}
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
