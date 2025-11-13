<template>
	<div class="flex justify-center">
		<div class="flex flex-col gap-1">
			<InputField reverse label="Selectable">
				<InputCheckbox v-model="object.userData.isSelectable" />
			</InputField>
			<InputField reverse label="Frustum Culled">
				<InputCheckbox v-model="object.frustumCulled" />
			</InputField>
			<template v-if="!('isLight' in object)">
				<InputField reverse label="Cast shadow">
					<InputCheckbox v-model="object.castShadow" />
				</InputField>
				<InputField reverse label="Receive shadow">
					<InputCheckbox v-model="object.receiveShadow" />
				</InputField>
			</template>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { useThreeStore } from '@/store/three'
import type THREE from '@/three'
import { computed } from 'vue'

const threeStore = useThreeStore()

const object = computed(() => threeStore.selectedObject as THREE.Object3D | THREE.Light)
</script>
