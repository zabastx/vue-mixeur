<template>
	<AboutModal v-model="aboutModalOpen" />
	<ModelsLibraryModal v-model="modelLibraryModalOpen" />
	<TextureLibraryModal v-model="textureLibraryModalOpen" />
</template>

<script lang="ts" setup>
import {
	aboutModalOpen,
	modelLibraryModalOpen,
	textureLibraryModalOpen
} from '@/composables/modals'
</script>
