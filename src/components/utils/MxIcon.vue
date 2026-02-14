<template>
	<component :is="icon" v-bind="$attrs" />
</template>

<script lang="ts" setup>
import { computed, defineAsyncComponent } from 'vue'

const props = defineProps<{
	name: MxIconName
}>()

const icon = computed(() => {
	const fileArr = props.name.split('/')
	const folder = fileArr[0]
	const filename = fileArr[1]
	return defineAsyncComponent(() => import(`@/assets/icons/${folder}/${filename}.svg?component`))
})
</script>
