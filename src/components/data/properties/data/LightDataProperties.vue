<template>
	<MAccordionRoot collapsible type="multiple">
		<MAccordionItem v-if="light" label="Light" :item="{ value: 'light' }">
			<div class="text-xs flex flex-col items-end gap-1 pr-2.5">
				<InputField label="Color">
					<input v-model="lightColor" type="color" class="h-full rounded w-[150px]" />
				</InputField>
				<InputField v-if="'power' in light" label="Power">
					<InputNumber v-model="light.power" :min="0" :step="0.1" class="max-w-[150px]" />
				</InputField>
				<InputField v-else label="Strength">
					<InputNumber v-model="light.intensity" :step="0.1" class="max-w-[150px]" />
				</InputField>
				<InputField v-if="'distance' in light" label="Distance">
					<InputNumber v-model="light.distance" :min="0" :step="0.1" class="max-w-[150px]" />
				</InputField>
				<InputField v-if="light.shadow" label="Cast shadow">
					<div class="w-[150px]">
						<InputCheckbox v-model="light.castShadow" />
					</div>
				</InputField>
				<InputField v-if="light.shadow" label="Shadow intensity">
					<InputNumber
						v-model="light.shadow.intensity"
						:min="0"
						:max="1"
						:step="0.01"
						class="max-w-[150px]"
						:format-options="{ style: 'percent' }"
					/>
				</InputField>
				<template v-if="light instanceof RectAreaLight">
					<InputField label="Width">
						<InputNumber v-model="light.width" :step="0.1" :min="0" class="max-w-[150px]" />
					</InputField>
					<InputField label="Height">
						<InputNumber v-model="light.height" :step="0.1" :min="0" class="max-w-[150px]" />
					</InputField>
				</template>
				<template v-if="light instanceof THREE.SpotLight">
					<InputField label="Angle">
						<InputNumber
							v-model="spotLightAngle"
							:step="0.1"
							:min="0"
							:max="MathUtils.radToDeg(Math.PI / 2)"
							class="max-w-[150px]"
							:format-options="{ unit: 'degree', unitDisplay: 'narrow', style: 'unit' }"
						/>
					</InputField>
				</template>
			</div>
		</MAccordionItem>
	</MAccordionRoot>
</template>

<script lang="ts" setup>
import { useThreeStore } from '@/store/three'
import THREE from '@/three'
import { MathUtils, RectAreaLight } from 'three'
import { computed } from 'vue'

const store = useThreeStore()

const light = computed<LightTypes | null>(() => {
	if (store.selectedObject) {
		const obj = store.selectedObject as LightTypes
		return obj
	}
	return null
})

const lightColor = computed({
	set(val: string) {
		const light = store.selectedObject
		if (light && light instanceof THREE.Light) {
			light.color.set(new THREE.Color(val))
		}
	},
	get() {
		return '#' + light.value?.color.getHexString() || ''
	}
})

const spotLightAngle = computed({
	set(val: number) {
		if (light.value instanceof THREE.SpotLight) {
			light.value.angle = MathUtils.degToRad(val)
		}
	},
	get() {
		if (light.value instanceof THREE.SpotLight) {
			return MathUtils.radToDeg(light.value.angle)
		}
		return 0
	}
})

type LightTypes = THREE.PointLight | THREE.DirectionalLight | THREE.SpotLight | RectAreaLight
</script>
