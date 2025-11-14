<template>
	<Popover.Root>
		<Popover.Trigger
			class="inline-grid rounded grid-cols-2 grid-rows-1 w-full checkerboard h-full overflow-hidden"
			:style="{ '--color-value': modelHex, '--alpha': modelAlpha }"
		>
			<div class="bg-(--color-value)"></div>
			<div class="bg-(--color-value) opacity-(--alpha)"></div>
		</Popover.Trigger>
		<Popover.Portal>
			<Popover.Content
				avoid-collisions
				position-strategy="absolute"
				class="bg-ui-menu-bg-inner rounded p-2"
			>
				<ColorPicker v-model="modelHex" v-model:alpha="modelAlpha" />
			</Popover.Content>
		</Popover.Portal>
	</Popover.Root>
</template>

<script lang="ts" setup>
import { Popover } from 'reka-ui/namespaced'

const modelHex = defineModel<string>('hex', { required: true })
const modelAlpha = defineModel<number>('alpha')
</script>
