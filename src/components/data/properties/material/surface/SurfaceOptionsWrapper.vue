<template>
	<MatSurfacePrincipled v-if="type === 'principled_bsdf'" />
	<MatSurfaceDiffuse v-else-if="type === 'diffuse_bsdf'" />
</template>

<script lang="ts" setup>
defineProps<{
	type?: 'principled_bsdf' | 'diffuse_bsdf' | null
}>()
</script>
