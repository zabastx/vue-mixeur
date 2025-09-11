<template>
	<div ref="css" class="p-1.5">
		<label v-if="threeStore.selectedObject" class="text-sm mb-2.5 block">
			Name:
			<input
				v-model="threeStore.selectedObject.name"
				type="text"
				class="bg-(--color-ui-text-inner) outline-none p-0.5 rounded"
			/>
		</label>
		<AccordionRoot default-value="transform" collapsible type="multiple" class="mt-1">
			<AccordionItem value="transform" class="rounded overflow-hidden">
				<AccordionHeader class="bg-(--color-properties-panel-header) p-0.5">
					<AccordionTrigger class="cursor-pointer group flex items-center w-full">
						<IconChevronRight
							class="inline-block group-data-[state='open']:rotate-90 transition-rotate duration-200"
						/>
						<span>Transform</span>
					</AccordionTrigger>
				</AccordionHeader>
				<AccordionContent
					class="bg-(--color-properties-panel-background) p-1 overflow-hidden animation-slide pb-2.5"
				>
					<TransformLocation
						v-if="threeStore.selectedObject"
						v-model="threeStore.selectedObject.position"
					/>
				</AccordionContent>
			</AccordionItem>
		</AccordionRoot>
	</div>
</template>

<script lang="ts" setup>
import IconChevronRight from '@/components/icons/IconChevronRight.vue'
import { useThreeStore } from '@/store/three'
import TransformLocation from './transform/TransformLocation.vue'

const threeStore = useThreeStore()
</script>

<style scoped>
.animation-slide[data-state='open'] {
	animation: slide-down 200ms ease-out;
}

.animation-slide[data-state='closed'] {
	animation: slide-up 200ms ease-out;
}

@keyframes slide-down {
	from {
		height: 0;
	}
	to {
		height: var(--reka-accordion-content-height);
	}
}

@keyframes slide-up {
	from {
		height: var(--reka-accordion-content-height);
	}
	to {
		height: 0;
	}
}
</style>
