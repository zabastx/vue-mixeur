<template>
	<h1 class="mb-1">Text Properties</h1>
	<MAccordionRoot collapsible type="multiple">
		<MAccordionItem label="Text" :item="{ value: 'text' }">
			<div class="flex flex-col items-end gap-1 text-xs">
				<InputField label="Text" class="w-[200px]">
					<input v-model="text" type="text" class="input" />
				</InputField>
				<InputField label="Font" class="w-[200px]">
					<InputSelect v-model="selectedFont" :items="items" />
				</InputField>
				<button type="button" class="btn" @click="onApply">Apply</button>
			</div>
		</MAccordionItem>
		<MAccordionItem label="Geometry" :item="{ value: 'geometry' }" class="mt-1">
			<div class="flex flex-col gap-1 text-xs">asdasd</div>
		</MAccordionItem>
	</MAccordionRoot>
</template>

<script lang="ts" setup>
import { useThreeStore } from '@/store/three'
import THREE, { enableBVH } from '@/three'
import { loadFont, type StdFontName } from '@/three/modules/loaders/font'
import { createTextGeometry } from '@/three/modules/text'
import { TextGeometry } from 'three/examples/jsm/Addons.js'
import { ref } from 'vue'

const store = useThreeStore()

const text = ref('Text')

const items: FontOption[] = [
	{
		value: 'helvetiker_regular',
		label: 'Helvetiker Regular'
	},
	{
		value: 'optimer_regular',
		label: 'Optimer Regular'
	},
	{
		value: 'gentilis_regular',
		label: 'Gentilis Regular'
	},
	{
		value: 'helvetiker_bold',
		label: 'Helvetiker Bold'
	},
	{
		value: 'optimer_bold',
		label: 'Optimer Bold'
	},
	{
		value: 'gentilis_bold',
		label: 'Gentilis Bold'
	}
] as const

const selectedFont = ref<FontOption>(items[0]!)

async function onApply() {
	const obj = store.selectedObject
	if (obj && obj instanceof THREE.Mesh && obj.geometry instanceof TextGeometry) {
		const font = await loadFont(selectedFont.value.value)
		if (!font) return

		obj.geometry.dispose()
		const newGeometry = createTextGeometry({
			text: text.value,
			params: {
				font,
				size: 2,
				depth: 1
			}
		})

		obj.geometry = newGeometry
		enableBVH(obj)
	}
}

interface FontOption {
	value: StdFontName
	label: string
}
</script>
