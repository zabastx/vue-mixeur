<template>
	<ToastProvider>
		<TooltipProvider :delay-duration="300" disable-hoverable-content>
			<div class="flex h-full flex-col font-sans text-gray-200">
				<TopBar v-if="threeStore.isInitiated" />

				<main class="grid min-h-0 flex-1 grid-cols-(--main-cols) bg-editor-border p-1 select-none">
					<MxViewport class="block-border" />
					<div ref="divider" class="divider w-1 cursor-col-resize"></div>
					<MxSidebar v-if="threeStore.isInitiated">
						<template #top>
							<DataOutliner />
						</template>
						<template #bottom>
							<DataProperties />
						</template>
					</MxSidebar>
				</main>

				<StatusBar v-show="appStore.showStatusBar" />
			</div>
			<ModelLoadingProgress />
			<MxToast />
			<ModalCollection />
		</TooltipProvider>
	</ToastProvider>
</template>

<script lang="ts" setup>
import { defineAsyncComponent, ref, useTemplateRef } from 'vue'
import { useEventListener } from '@vueuse/core'
import { ToastProvider, TooltipProvider } from 'reka-ui'
import { useAppStore } from '@/app/model/app'
import { useThreeStore } from '@/app/model/three'

const ModalCollection = defineAsyncComponent(() => import('@/widgets/modals/ModalCollection.vue'))

const appStore = useAppStore()
const threeStore = useThreeStore()

const divider = useTemplateRef('divider')
const rightWidth = ref(window.innerWidth * 0.25)

useEventListener(divider, 'pointerdown', (e: PointerEvent) => {
	const startX = e.clientX
	const startWidth = rightWidth.value

	const move = (ev: PointerEvent) => {
		const delta = startX - ev.clientX
		rightWidth.value = Math.max(200, startWidth + delta)
	}

	const cancel = useEventListener(window, 'pointermove', move)
	useEventListener(window, 'pointerup', cancel)
})
</script>

<style scoped>
main {
	--col-width: v-bind(rightWidth + 'px');
	--main-cols: 1fr min-content var(--col-width);
}
</style>
