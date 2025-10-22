<template>
	<label v-if="threeStore.selectedObject" class="mb-2.5 block text-sm">
		Name:
		<input
			v-model="threeStore.selectedObject.name"
			type="text"
			class="rounded bg-(--color-ui-text-inner) p-0.5 outline-none"
		/>
	</label>
	<Accordion.Root default-value="transform" collapsible type="multiple" class="mt-1">
		<Accordion.Item value="transform" class="overflow-hidden rounded">
			<Accordion.Header class="bg-(--color-properties-panel-header) px-2 py-0.5">
				<Accordion.Trigger class="group flex w-full cursor-pointer items-center gap-1">
					<IconArrowRight
						class="transition-rotate inline-block size-[1em] text-xs duration-200 group-data-[state='open']:rotate-90"
					/>
					<span>Transform</span>
				</Accordion.Trigger>
			</Accordion.Header>
			<Accordion.Content
				v-if="threeStore.selectedObject"
				class="animation-slide overflow-hidden bg-(--color-properties-panel-background) p-1 pr-3 pb-2.5 text-xs"
			>
				<TransformLocation />
				<TransformRotation class="mt-1" />
				<TransformScale class="mt-1" />
			</Accordion.Content>
		</Accordion.Item>
	</Accordion.Root>
</template>

<script lang="ts" setup>
import { useThreeStore } from '@/store/three'
import TransformLocation from './transform/TransformLocation.vue'
import { Accordion } from 'reka-ui/namespaced'

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
