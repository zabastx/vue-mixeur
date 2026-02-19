<template>
	<ToastViewport class="fixed right-4 bottom-4 z-50 flex max-w-sm flex-col gap-2" />

	<ToastRoot
		v-for="toast in toasts"
		:key="toast.id"
		:open="toast.open"
		:duration="toast.duration"
		@update:open="(open) => !open && removeToast(toast.id)"
	>
		<div class="toast-content">
			<div class="flex items-start gap-2">
				<div class="toast-icon" :class="getToastTypeClass(toast.type)"></div>
				<div class="flex-1">
					<ToastTitle v-if="toast.title" class="toast-title">
						{{ toast.title }}
					</ToastTitle>
					<ToastDescription class="toast-description">
						{{ toast.message }}
					</ToastDescription>
				</div>
				<ToastClose class="toast-close">
					<span class="sr-only">Close</span>
					<svg class="h-3 w-3" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path
							d="m11.7816 4.03157c.0824-.08241.0824-.21569 0-.2981-.0824-.08241-.2157-.08241-.2981 0L7.50002 7.70792 3.51852 3.73307c-.08241-.08241-.21569-.08241-.2981 0-.08241.08241-.08241.21569 0 .2981L7.20192 7.99997 3.22002 11.9819c-.08241.0824-.08241.2157 0 .2981.08241.0824.21569.0824.2981 0L7.50002 8.30202l3.98148 3.98148c.0824.0824.2157.0824.2981 0 .0824-.0824.0824-.2157 0-.2981L7.79812 7.99997l3.98148-3.9684z"
							fill="currentColor"
							fill-rule="evenodd"
							clip-rule="evenodd"
						/>
					</svg>
				</ToastClose>
			</div>
		</div>
	</ToastRoot>
</template>

<script lang="ts" setup>
import { ToastClose, ToastDescription, ToastRoot, ToastTitle, ToastViewport } from 'reka-ui'
import { ref } from 'vue'

export interface ToastOptions {
	id?: string
	title?: string
	message: string
	type?: 'info' | 'success' | 'warning' | 'error'
	duration?: number
}

interface Toast extends Required<Omit<ToastOptions, 'title'>> {
	title?: string
	open: boolean
}

const toasts = ref<Toast[]>([])
let toastIdCounter = 0

const addToast = (options: ToastOptions) => {
	const id = options.id || `toast-${++toastIdCounter}`
	const toast: Toast = {
		id,
		title: options.title,
		message: options.message,
		type: options.type || 'info',
		duration: options.duration || 5000,
		open: true
	}

	toasts.value.push(toast)
	return id
}

const removeToast = (id: string) => {
	const index = toasts.value.findIndex((toast) => toast.id === id)
	if (index > -1) {
		toasts.value.splice(index, 1)
	}
}

const clearAllToasts = () => {
	toasts.value = []
}

const getToastTypeClass = (type: Toast['type']) => {
	const classes = {
		info: 'toast-icon-info',
		success: 'toast-icon-success',
		warning: 'toast-icon-warning',
		error: 'toast-icon-error'
	}
	return classes[type]
}

defineExpose({
	addToast,
	removeToast,
	clearAllToasts
})
</script>

<style scoped>
@reference 'tailwindcss/theme';

.toast-content {
	@apply rounded border border-(--color-ui-tooltip-outline) bg-(--color-ui-tooltip-inner) p-3 shadow-lg;
	@apply max-w-sm min-w-[300px];
	animation: slide 300ms ease-in forwards;
}

@keyframes slide {
	0% {
		translate: 100%;
	}
	100% {
		translate: 0%;
	}
}

.toast-icon {
	@apply flex h-5 w-5 items-center justify-center rounded-full text-xs font-bold;
}

.toast-icon-info {
	@apply bg-blue-500/20 text-blue-400;
}

.toast-icon-info::before {
	content: 'i';
}

.toast-icon-success {
	@apply bg-green-500/20 text-green-400;
}

.toast-icon-success::before {
	content: '✓';
}

.toast-icon-warning {
	@apply bg-yellow-500/20 text-yellow-400;
}

.toast-icon-warning::before {
	content: '!';
}

.toast-icon-error {
	@apply bg-red-500/20 text-red-400;
}

.toast-icon-error::before {
	content: '✕';
}

.toast-title {
	@apply text-sm font-medium text-(--color-ui-tooltip-text);
}

.toast-description {
	@apply mt-1 text-xs text-(--color-ui-tooltip-text) opacity-90;
}

.toast-close {
	@apply flex h-5 w-5 items-center justify-center rounded opacity-50 transition-opacity hover:opacity-100;
	@apply text-(--color-ui-tooltip-text);
}

.list-enter-active,
.list-leave-active {
	transition: all 0.5s ease;
}
.list-enter-from,
.list-leave-to {
	opacity: 0;
	transform: translateX(100px);
}
</style>
