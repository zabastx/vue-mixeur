<template>
	<input v-model="model" type="color" class="h-full rounded w-[150px]" />
</template>

<script lang="ts" setup>
import type { InputHTMLAttributes } from 'vue'

const model = defineModel<InputHTMLAttributes['value']>()
</script>
