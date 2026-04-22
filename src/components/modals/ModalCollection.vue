<template>
	<ModalAbout v-model="openModals.about" />
	<AssetBrowserModels v-model="openModals.modelsLibrary" />
	<AssetBrowserTextures
		v-model="openModals.textureLibrary"
		:callback="dialogCallbacks.textureLibrary"
	/>
	<RenderImageModal v-model="openModals.renderImage" />
	<ImportSceneModal v-model="openModals.importScene" />
</template>

<script lang="ts" setup>
import { openModals, dialogCallbacks } from '@/composables/useModals'
</script>
