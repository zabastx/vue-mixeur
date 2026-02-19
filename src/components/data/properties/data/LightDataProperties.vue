<template>
	<MxAccordionRoot collapsible type="multiple">
		<MxAccordionItem v-if="light" label="Light" :item="{ value: 'light' }">
			<div class="text-xs flex flex-col items-end gap-1 p-2">
				<InputField label="Color" input-width="150px">
					<InputColor v-model:hex="lightColor" />
				</InputField>
				<InputField v-if="'power' in light" label="Power" input-width="150px">
					<InputNumber v-model="light.power" :min="0" :step="0.1" />
				</InputField>
				<InputField v-else label="Strength" input-width="150px">
					<InputNumber v-model="light.intensity" :step="0.1" />
				</InputField>
				<InputField v-if="'distance' in light" label="Distance" input-width="150px">
					<InputNumber v-model="light.distance" :min="0" :step="0.1" />
				</InputField>
				<template v-if="isRectAreaLight(light)">
					<InputField label="Width" input-width="150px">
						<InputNumber v-model="light.width" :step="0.1" :min="0" />
					</InputField>
					<InputField label="Height" input-width="150px">
						<InputNumber v-model="light.height" :step="0.1" :min="0" />
					</InputField>
				</template>
				<template v-if="isSpotLight(light)">
					<InputField label="Angle" input-width="150px">
						<InputNumber
							v-model="spotLightAngle"
							:step="0.1"
							:min="0"
							:max="MathUtils.radToDeg(Math.PI / 2)"
							:format-options="{ unit: 'degree', unitDisplay: 'narrow', style: 'unit' }"
						/>
					</InputField>
				</template>
			</div>
		</MxAccordionItem>
		<MxAccordionItem
			v-if="light?.shadow"
			v-model="light.castShadow"
			:item="{ value: 'shadow' }"
			label="Shadow"
			class="w-full mt-1"
			show-checkbox
		>
			<div class="flex flex-col items-end gap-1 p-2">
				<InputField label="Bias" input-width="150px" :tooltip="tooltipMap.get('bias')">
					<InputNumber
						v-model="light.shadow.bias"
						:step="0.0001"
						:format-options="{ minimumFractionDigits: 4 }"
					/>
				</InputField>
				<InputField label="Normal Bias" input-width="150px" :tooltip="tooltipMap.get('normalBias')">
					<InputNumber
						v-model="light.shadow.normalBias"
						:step="0.0001"
						:format-options="{ minimumFractionDigits: 4 }"
					/>
				</InputField>
				<InputField label="Intensity" input-width="150px" :tooltip="tooltipMap.get('intensity')">
					<InputNumber
						v-model="light.shadow.intensity"
						:min="0"
						:max="1"
						:step="0.01"
						:format-options="{ style: 'percent' }"
					/>
				</InputField>
			</div>
		</MxAccordionItem>
	</MxAccordionRoot>
</template>

<script lang="ts" setup>
import type { MxTooltipContent } from '@/components/utils/MxTooltip.vue'
import { useThreeStore } from '@/store/three'
import THREE from '@/three'
import { MathUtils } from 'three'
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

type LightTypes = THREE.PointLight | THREE.DirectionalLight | THREE.SpotLight | THREE.RectAreaLight

function isRectAreaLight(light: LightTypes): light is THREE.RectAreaLight {
	return light instanceof THREE.RectAreaLight
}

function isSpotLight(light: LightTypes): light is THREE.SpotLight {
	return light instanceof THREE.SpotLight
}

const tooltipMap: ReadonlyMap<string, MxTooltipContent> = new Map([
	[
		'bias',
		{
			title: 'Shadow map bias',
			text: 'How much to add or subtract from the normalized depth when deciding whether a surface is in shadow'
		}
	],
	[
		'normalBias',
		{
			title: 'Shadow map normal bias',
			text: 'Defines how much the position used to query the shadow map is offset along the object normal. Increasing this value can be used to reduce shadow acne especially in large scenes where light shines onto geometry at a shallow angle. The cost is that shadows may appear distorted.'
		}
	],
	[
		'intensity',
		{
			text: 'The intensity of the shadow'
		}
	]
])
</script>
