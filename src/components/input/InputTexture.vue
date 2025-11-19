<template>
	<div class="group">
		<div
			class="rounded border border-ui-menu-outline bg-ui-menu-inner px-1 py-0.5 text-ui-menu-text
				grid grid-cols-[1fr_auto] gap-1"
			tabindex="0"
		>
			<span class="overflow-hidden text-ellipsis" :title="model?.name">
				{{ model?.name || 'None' }}
			</span>
			<button v-if="model" type="button" class="cursor-pointer px-1" @click="removeMap">x</button>
		</div>
		<div class="hidden grid-cols-2 group-focus-within:grid">
			<button type="button" class="btn" @click="openLibrary">Library</button>
			<button type="button" class="btn" @click="open()">File</button>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { textureLibraryCallback, textureLibraryModalOpen } from '@/composables/modals'
import THREE from '@/three'
import { useFileDialog } from '@vueuse/core'

const model = defineModel<THREE.Texture | null>()

const { open, onChange } = useFileDialog({
	multiple: false,
	accept: 'image/*'
})

onChange(async (files) => {
	const file = files?.[0]
	if (!file) return
	const url = URL.createObjectURL(file)
	const loader = new THREE.TextureLoader()
	const texture = await loader.loadAsync(url)
	URL.revokeObjectURL(url)
	texture.name = file.name
	const oldTexture = model.value
	model.value = texture
	if (oldTexture) oldTexture.dispose()
})

function openLibrary() {
	textureLibraryCallback.value = async (file) => {
		const name = file.url.match(/[^/]+$/)?.[0] ?? 'Texture'
		const loader = new THREE.TextureLoader()
		const texture = await loader.loadAsync(file.url)
		texture.name = name
		model.value = texture
	}
	textureLibraryModalOpen.value = true
}

function removeMap() {
	if (model.value) {
		const texture = model.value
		model.value = null
		texture.dispose()
	}
}
</script>
