<template>
	<MxPopover>
		<template #trigger>
			<div
				class="inline-grid rounded grid-cols-2 grid-rows-1 w-full checkerboard h-full
					overflow-hidden"
				:style="{ '--color-value': modelHex, '--alpha': modelAlpha }"
			>
				<div class="bg-(--color-value)"></div>
				<div class="bg-(--color-value) opacity-(--alpha)"></div>
			</div>
		</template>
		<template #content>
			<ColorPicker v-model="modelHex" v-model:alpha="modelAlpha" :transparency />
		</template>
	</MxPopover>
</template>

<script lang="ts" setup>
defineProps<{
	transparency?: boolean
}>()

const modelHex = defineModel<string>('hex', { required: true })
const modelAlpha = defineModel<number>('alpha')
</script>
