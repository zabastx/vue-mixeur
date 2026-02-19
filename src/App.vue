<template>
	<ToastProvider>
		<TooltipProvider :delay-duration="300" disable-hoverable-content>
			<div class="flex h-full flex-col font-sans text-gray-200">
				<TopBar v-if="threeStore.isInitiated" />

				<main class="grid min-h-0 flex-1 grid-cols-(--main-cols) bg-editor-border p-1 select-none">
					<MViewport class="block-border" />
					<div ref="divider" class="divider w-1 cursor-col-resize"></div>
					<MSidebar v-if="threeStore.isInitiated" />
				</main>

				<StatusBar v-show="appStore.showStatusBar" />

				<ModelLoadingProgress />
				<MToast ref="toastRef" />
				<ModalCollection />
			</div>
		</TooltipProvider>
	</ToastProvider>
</template>

<script lang="ts" setup>
import { ref, useTemplateRef, onMounted } from 'vue'
import MSidebar from './components/sidebar/MSidebar.vue'
import { useEventListener } from '@vueuse/core'
import MViewport from './components/viewport/MViewport.vue'
import StatusBar from './components/status/StatusBar.vue'
import TopBar from './components/header/TopBar.vue'
import ModelLoadingProgress from './components/utils/ModelLoadingProgress.vue'
import MToast from './components/utils/MToast.vue'
import { ToastProvider, TooltipProvider } from 'reka-ui'
import { useAppStore } from './store/app'
import { useToast } from './composables/useToast'
import { useThreeStore } from './store/three'

const appStore = useAppStore()
const threeStore = useThreeStore()

const { setToastInstance } = useToast()
const toastRef = useTemplateRef('toastRef')

onMounted(() => {
	if (toastRef.value) {
		setToastInstance(toastRef.value)
	}
})

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
