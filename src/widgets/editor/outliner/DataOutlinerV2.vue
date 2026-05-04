<template>
	<div
		class="block-border text-sm leading-6 flex flex-col overflow-hidden rounded bg-window-bg
			alternate-rows relative"
	>
		<h2 class="flex items-center gap-1 px-1 text-[1rem]">
			<MxIcon name="outliner/outliner" /> Outliner
			<MxTooltip :tooltip="{ text: 'Add Group' }">
				<button class="btn ml-auto" type="button" @click="sceneStore.addGroup">
					<MxIcon name="outliner/group-new" />
				</button>
			</MxTooltip>
		</h2>
		<ScrollContainer>
			<div class="flex justify-between items-center">
				<h3 class="flex items-center gap-1 px-1"><MxIcon name="ui/collection" /> Scene</h3>
			</div>
			<OutlinerTree
				v-model="selectedObject"
				:items="outlinerItems"
				:render-camera-id="cameraStore.renderCamera?.uuid"
				@set-active-camera="cameraStore.setRenderCamera($event)"
			/>
		</ScrollContainer>
	</div>
</template>

<script lang="ts" setup>
import { useSceneStore } from '@/app/model/scene'
import { getUserData } from '@/shared/three/utils'
import { computed } from 'vue'
import type { OutlinerItem } from './DataOutlinerItem.vue'
import THREE from '@/shared/three'
import { useCameraStore } from '@/app/model/camera'
import { useThreeStore } from '@/app/model/three'

const sceneStore = useSceneStore()
const cameraStore = useCameraStore()
const threeStore = useThreeStore()

const selectedObject = computed<OutlinerItem | undefined>({
	set(obj) {
		threeStore.selectObject(obj?.uuid)
	},
	get() {
		return threeStore.selectedObject ? parseObject(threeStore.selectedObject) : undefined
	}
})

const outlinerItems = computed(() => {
	return sceneStore.sceneChildren
		.filter((item) => !getUserData(item).hideInOutliner)
		.map(parseObject)
})

function parseObject(obj: THREE.Object3D): OutlinerItem {
	return {
		uuid: obj.uuid,
		type: obj.type,
		name: obj.name || obj.type,
		userData: getUserData(obj),
		isCamera: obj instanceof THREE.Camera,
		children: obj.children.length > 0 ? obj.children.map(parseObject) : undefined
	}
}
</script>
