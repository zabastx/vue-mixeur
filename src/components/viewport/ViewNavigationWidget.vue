<template>
	<div class="flex flex-col gap-1">
		<MxTooltip
			:tooltip="{
				text: 'Switch the current view from perspective/orthographic projection',
				footer: 'Shortcut: Numpad 5'
			}"
			:options="{
				content: {
					align: 'start',
					alignOffset: -10,
					side: 'bottom',
					sideOffset: 5
				}
			}"
		>
			<button
				type="button"
				class="cursor-pointer rounded-full bg-black p-1.5 text-xl text-white opacity-50
					hover:bg-gray-500"
				@click="cameraStore.switchViewportCamera"
			>
				<MxIcon
					v-if="cameraStore.viewportCameraType === 'perspective'"
					name="view/view-perspective"
				/>
				<MxIcon v-else name="view/view-orthographic" />
			</button>
		</MxTooltip>
		<MxTooltip
			:tooltip="{
				text: 'Toggle the camera view',
				footer: 'Shortcut: Numpad 0'
			}"
			:options="{
				content: {
					align: 'start',
					alignOffset: -10,
					side: 'bottom',
					sideOffset: 5
				}
			}"
		>
			<button
				type="button"
				class="cursor-pointer rounded-full bg-black p-1.5 text-xl text-white opacity-50
					hover:bg-gray-500"
				@click="cameraStore.toggleCameraView"
			>
				<MxIcon v-if="cameraStore.viewportCameraType === 'perspective'" name="outliner/camera" />
				<MxIcon v-else name="outliner/camera-obj" />
			</button>
		</MxTooltip>
	</div>
</template>

<script lang="ts" setup>
import { useCameraStore } from '@/store/camera'

const cameraStore = useCameraStore()
</script>
