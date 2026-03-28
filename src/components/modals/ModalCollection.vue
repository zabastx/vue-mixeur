<template>
	<ModalAbout v-model="openModals.about" />
	<ModalModelsLibrary v-model="openModals.modelsLibrary" />
	<ModalTextureLibrary
		v-model="openModals.textureLibrary"
		:callback="dialogCallbacks.textureLibrary"
	/>
	<ModalRenderImage v-model="openModals.renderImage" />
	<ModalImportScene v-model="openModals.importScene" />
</template>

<script lang="ts" setup>
import { openModals, dialogCallbacks } from '@/composables/useModals'
</script>
