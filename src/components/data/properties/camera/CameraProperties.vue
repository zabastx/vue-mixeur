<template>
	<MxAccordionRoot collapsible type="multiple" class="space-y-0.5" :default-value="['lens']">
		<MxAccordionItem label="Lens" :item="{ value: 'lens' }">
			<div class="p-1 flex flex-col gap-0.5 items-end">
				<InputField label="Type" input-width="150px" class="mb-1">
					<InputSelect v-model="cameraStore.viewportCameraType" :items="TYPE_OPTIONS" />
				</InputField>
				<template v-if="isPerspectiveCamera(currentViewportCamera)">
					<InputField
						v-if="currentLensUnit === 'fov'"
						label="Field of View"
						input-width="150px"
						:tooltip="{ text: 'The vertical field of view, from bottom to top of view' }"
					>
						<InputNumber
							v-model="currentViewportCamera.fov"
							:format-options="{
								style: 'unit',
								unitDisplay: 'narrow',
								unit: 'degree'
							}"
						/>
					</InputField>
					<InputField v-else label="Focal Length" input-width="150px">
						<InputNumber
							v-model="focalLength"
							:format-options="{
								style: 'unit',
								unitDisplay: 'narrow',
								unit: 'millimeter'
							}"
						/>
					</InputField>
					<InputField label="Lens Unit" input-width="150px">
						<InputSelect v-model="currentLensUnit" :items="LENS_UNIT_OPTIONS" />
					</InputField>
				</template>
				<InputField label="Zoom" input-width="150px">
					<InputNumber v-model="currentViewportCamera.zoom" :step="0.01" />
				</InputField>
				<InputField
					label="Clip Start"
					input-width="150px"
					class="mt-1"
					:tooltip="{ text: 'Camera near clipping distance' }"
				>
					<InputNumber v-model="currentViewportCamera.near" />
				</InputField>
				<InputField
					label="End"
					input-width="150px"
					:tooltip="{ text: 'Camera far clipping distance' }"
				>
					<InputNumber v-model="currentViewportCamera.far" />
				</InputField>
			</div>
		</MxAccordionItem>
		<MxAccordionItem label="Transform" :item="{ value: 'transform' }">
			<div class="p-1 flex flex-col gap-0.5 items-end">
				<InputField label="Position X" input-width="150px">
					<InputNumber v-model="currentViewportCamera.position.x" />
				</InputField>
				<InputField label="Y" input-width="150px">
					<InputNumber v-model="currentViewportCamera.position.y" />
				</InputField>
				<InputField label="Z" input-width="150px">
					<InputNumber v-model="currentViewportCamera.position.z" />
				</InputField>
			</div>
		</MxAccordionItem>
	</MxAccordionRoot>
</template>

<script lang="ts" setup>
import { useCameraStore } from '@/store/camera'
import THREE from '@/three'
import { computed, ref } from 'vue'

const cameraStore = useCameraStore()

const currentViewportCamera = computed<THREE.PerspectiveCamera | THREE.OrthographicCamera>(
	() => cameraStore.viewportCameras[cameraStore.viewportCameraType]
)

function isPerspectiveCamera(
	camera: THREE.PerspectiveCamera | THREE.OrthographicCamera
): camera is THREE.PerspectiveCamera {
	return camera.type === 'PerspectiveCamera'
}

const TYPE_OPTIONS = [
	{
		label: 'Perspective',
		value: 'perspective'
	},
	{
		label: 'Orthographic',
		value: 'orthographic'
	}
] as const

const currentLensUnit = ref<(typeof LENS_UNIT_OPTIONS)[number]['value']>('fov')

const focalLength = computed<number>({
	set(val) {
		if ('getFocalLength' in currentViewportCamera.value) {
			return currentViewportCamera.value.setFocalLength(val)
		}
	},
	get() {
		if ('getFocalLength' in currentViewportCamera.value) {
			return currentViewportCamera.value.getFocalLength()
		}
		return 0
	}
})

const LENS_UNIT_OPTIONS = [
	{
		label: 'Field of View',
		value: 'fov'
	},
	{
		label: 'Millimeters',
		value: 'focal'
	}
] as const
</script>
