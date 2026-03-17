/// <reference types="vite/client" />

declare module 'virtual:pwa-register' {
	export interface RegisterSWOptions {
		onNeedRefresh?: () => void
		onOfflineReady?: () => void
		onRegistered?: (registration: ServiceWorkerRegistration) => void
		onRegisterError?: (error: Error) => void
	}

	export interface RegisterSWReturn {
		update: (reload?: boolean) => Promise<void>
	}

	export type RegisterSW = (options?: RegisterSWOptions) => RegisterSWReturn

	const registerSW: RegisterSW
	export { registerSW }
}
