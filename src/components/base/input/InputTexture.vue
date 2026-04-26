<template>
	<div class="group">
		<div
			class="rounded border border-ui-menu-outline bg-ui-menu-inner px-1 py-0.5 text-ui-menu-text
				grid grid-cols-[1fr_auto] gap-1"
			:tabindex="disabled ? undefined : 0"
		>
			<span class="truncate" :title="model?.name">
				{{ model?.name ?? 'None' }}
			</span>
			<button v-if="model" type="button" class="cursor-pointer px-1" @click="reset">
				<MxIcon name="ui/close" />
			</button>
		</div>
		<div class="hidden grid-cols-2 group-focus-within:grid">
			<button type="button" class="btn" @click="openLibrary">Library</button>
			<button type="button" class="btn" @click="open()">File</button>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { isPolyHavenFileInfo } from '@/components/asset-browser/types/polyhaven'
import { useModals } from '@/composables/useModals'
import THREE from '@/three'
import { loadEXR } from '@/three/modules/loaders/exr'
import { loadTexture } from '@/three/modules/loaders/textureLoader'
import { useFileDialog } from '@vueuse/core'

const { isEnvMap = false } = defineProps<{
	disabled?: boolean
	isEnvMap?: boolean
}>()

const model = defineModel<THREE.Texture | null>()

const { open, onChange } = useFileDialog({
	multiple: false,
	accept: 'image/*, .exr'
})

onChange(async (files) => {
	const file = files?.[0]
	if (!file) return
	const url = URL.createObjectURL(file)
	const isEXR = file.name.toLowerCase().endsWith('.exr')

	const parameters = {
		url,
		filename: file.name,
		size: file.size,
		isEnvMap: isEnvMap
	}

	const texture = isEXR ? await loadEXR(parameters) : await loadTexture(parameters)

	URL.revokeObjectURL(url)

	if (!texture) return

	const oldTexture = model.value
	model.value = texture
	if (oldTexture) oldTexture.dispose()
})

const { open: openModal } = useModals()

function openLibrary() {
	openModal('textureLibrary', async (file) => {
		if (!isPolyHavenFileInfo(file)) return
		const isEXR = file.url.toLowerCase().endsWith('.exr')
		const filename = file.url.match(/[^/]+$/)?.[0] ?? 'Texture'
		const parameters = {
			url: file.url,
			filename,
			size: file.size,
			isEnvMap: isEnvMap
		}
		const texture = isEXR ? await loadEXR(parameters) : await loadTexture(parameters)
		if (!texture) return

		const oldTexture = model.value
		model.value = texture
		if (oldTexture) oldTexture.dispose()
	})
}

function reset() {
	if (model.value) {
		const texture = model.value
		model.value = null
		texture.dispose()
	}
}
</script>
