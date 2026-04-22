<template>
	<div class="space-y-1">
		<h2>Viewport Shading</h2>
		<h3 class="text-xs mt-2">Studio Light</h3>
		<MxPopover>
			<template #trigger>
				<button
					type="button"
					class="flex justify-center rounded border bg-ui-menu-inner border-ui-menu-outline
						hover:brightness-125 cursor-pointer w-full p-1"
				>
					<img
						:src="`/textures/world/${currentMapName}.png`"
						alt="current environment map"
						width="64"
						height="64"
					/>
				</button>
			</template>
			<template #content>
				<div class="flex gap-0.5">
					<MxTooltip
						v-for="map in DEFAULT_WORLD_MAPS"
						:key="map"
						:tooltip="{
							text: map.slice(0, 1).toUpperCase() + map.slice(1),
							footer: 'Studio lighting setup'
						}"
					>
						<button
							type="button"
							class="btn bg-ui-menu-inner border-ui-menu-outline"
							:class="{
								'bg-ui-menu-item-inner-selected': currentMapName === map
							}"
							@click="changeEnvMap(map)"
						>
							<img width="64" height="64" :src="`/textures/world/${map}.png`" :alt="map" />
						</button>
					</MxTooltip>
				</div>
			</template>
		</MxPopover>
		<div class="text-xs space-y-0.5">
			<InputField label="Rotation" label-width="80px">
				<InputNumber
					v-model="rotation"
					:format-options="{
						style: 'unit',
						unitDisplay: 'narrow',
						unit: 'degree'
					}"
					:min="-180"
					:max="180"
				/>
			</InputField>
			<InputField label="Strength" label-width="80px">
				<InputNumber v-model="threeStore.scene.environmentIntensity" :min="0" :step="0.1" />
			</InputField>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { DEFAULT_WORLD_MAPS, loadWorldTexture } from '@/three/modules/loaders/environment'
import { useShadingStore } from '@/store/shading'
import { MathUtils } from 'three'
import { useThreeStore } from '@/store/three'

const shadingStore = useShadingStore()

const currentMapName = computed(() => shadingStore.environmentMap?.name)
const isUpdating = ref(false)

async function changeEnvMap(map: (typeof DEFAULT_WORLD_MAPS)[number]) {
	if (isUpdating.value || currentMapName.value === map) return
	isUpdating.value = true
	const texture = await loadWorldTexture(map)
	if (!texture) return (isUpdating.value = false)
	shadingStore.setEnvironmentMap(texture)
	isUpdating.value = false
}

const threeStore = useThreeStore()

const rotation = computed({
	set(val) {
		threeStore.scene.environmentRotation.set(0, MathUtils.degToRad(val), 0)
	},
	get() {
		const envRotation = threeStore.scene.environmentRotation
		return MathUtils.radToDeg(envRotation.y)
	}
})
</script>
