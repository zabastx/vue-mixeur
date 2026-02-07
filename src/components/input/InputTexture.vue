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
import { useModals } from '@/composables/useModals'
import THREE from '@/three'
import { loadTexture } from '@/three/modules/loaders/textureLoader'
import { isPolyHavenFileInfo } from '@/utils/utils'
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

const { open: openModal } = useModals()

function openLibrary() {
	openModal('textureLibrary', async (file) => {
		if (!isPolyHavenFileInfo(file)) return
		const filename = file.url.match(/[^/]+$/)?.[0] ?? 'Texture'
		const texture = await loadTexture({ url: file.url, filename, size: file.size })
		model.value = texture
	})
}

function removeMap() {
	if (model.value) {
		const texture = model.value
		model.value = null
		texture.dispose()
	}
}
</script>
