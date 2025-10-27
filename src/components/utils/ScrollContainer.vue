<template>
	<ScrollArea.Root class="relative gap-1 overflow-hidden h-full" type="auto">
		<ScrollArea.Viewport class="snap h-full w-full snap-y snap-proximity">
			<slot></slot>
		</ScrollArea.Viewport>
		<ScrollArea.Scrollbar
			orientation="vertical"
			class="flex touch-none p-0.5 transition-colors duration-160 ease-out select-none
				data-[orientation=horizontal]:h-2.5 data-[orientation=horizontal]:flex-col
				data-[orientation=vertical]:w-2.5"
		>
			<ScrollArea.Thumb
				class="relative flex-1 rounded bg-ui-scrollbar before:absolute before:top-1/2
					before:left-1/2 before:h-full before:min-h-[44px] before:w-full before:min-w-5
					before:-translate-x-1/2 before:-translate-y-1/2 before:content-['']"
			/>
		</ScrollArea.Scrollbar>
	</ScrollArea.Root>
</template>

<script lang="ts" setup>
import { ScrollArea } from 'reka-ui/namespaced'
</script>
