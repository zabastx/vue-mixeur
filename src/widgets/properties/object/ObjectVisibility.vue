<template>
	<div v-if="selectedObject" class="flex justify-center p-1">
		<div class="flex flex-col gap-1">
			<InputField reverse label="Selectable">
				<InputCheckbox v-model="isSelectable" />
			</InputField>
			<InputField reverse label="Frustum Culled">
				<InputCheckbox v-model="selectedObject.frustumCulled" @update:model-value="updateObject" />
			</InputField>
			<template v-if="isMesh">
				<InputField reverse label="Cast shadow">
					<InputCheckbox v-model="selectedObject.castShadow" @update:model-value="updateObject" />
				</InputField>
				<InputField reverse label="Receive shadow">
					<InputCheckbox
						v-model="selectedObject.receiveShadow"
						@update:model-value="updateObject"
					/>
				</InputField>
			</template>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { useSceneStore } from '@/app/model/scene'
import { useThreeStore } from '@/app/model/three'
import THREE from '@/shared/three'
import { getUserData } from '@/shared/three/utils'
import { storeToRefs } from 'pinia'
import { computed, triggerRef } from 'vue'

const threeStore = useThreeStore()
const sceneStore = useSceneStore()

const { selectedObject } = storeToRefs(threeStore)

function updateObject() {
	triggerRef(selectedObject)
}

const isSelectable = computed<boolean>({
	set(val) {
		if (!selectedObject.value) return
		const helperUUID = getUserData(selectedObject.value).helperUUID
		if (helperUUID) {
			const helper = sceneStore.scene.getObjectByProperty('uuid', helperUUID)
			if (helper) {
				getUserData(helper).isSelectable = val
			}
		}
		getUserData(selectedObject.value).isSelectable = val
		updateObject()
	},
	get() {
		if (!selectedObject.value) return false
		const helperUUID = getUserData(selectedObject.value).helperUUID
		if (helperUUID) {
			const helper = sceneStore.scene.getObjectByProperty('uuid', helperUUID)
			if (helper) return !!getUserData(helper).isSelectable
		}
		return !!getUserData(selectedObject.value).isSelectable
	}
})

const isMesh = computed(() => selectedObject.value instanceof THREE.Mesh)
</script>
