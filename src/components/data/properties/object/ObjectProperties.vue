<template>
	<div ref="css" class="p-1.5">
		<label v-if="threeStore.selectedObject" class="mb-2.5 block text-sm">
			Name:
			<input
				v-model="threeStore.selectedObject.name"
				type="text"
				class="rounded bg-(--color-ui-text-inner) p-0.5 outline-none"
			/>
		</label>
		<AccordionRoot default-value="transform" collapsible type="multiple" class="mt-1">
			<AccordionItem value="transform" class="overflow-hidden rounded">
				<AccordionHeader class="bg-(--color-properties-panel-header) p-0.5">
					<AccordionTrigger class="group flex w-full cursor-pointer items-center">
						<IconChevronRight
							class="transition-rotate inline-block duration-200 group-data-[state='open']:rotate-90"
						/>
						<span>Transform</span>
					</AccordionTrigger>
				</AccordionHeader>
				<AccordionContent
					v-if="threeStore.selectedObject"
					class="animation-slide overflow-hidden bg-(--color-properties-panel-background) p-1 pb-2.5"
				>
					<TransformLocation />
					<TransformRotation class="mt-2" />
					<TransformScale class="mt-2" />
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
