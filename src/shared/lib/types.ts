import type THREE from '@/shared/three'

export interface InputSelectOption<T = string | number | Record<string, unknown> | null> {
	value: T
	label: string
	tooltip?: MxTooltipContent
	icon?: MxIconName
}

export interface MxTooltipContent {
	title?: string
	text?: string
	footer?: string
}

export type NonMethodKeys<T> = {
	[K in keyof T & string]: T[K] extends (...args: never[]) => unknown ? never : K
}[keyof T & string]

export function isPerspectiveCamera(
	camera: THREE.Camera | null
): camera is THREE.PerspectiveCamera {
	return camera?.type === 'PerspectiveCamera'
}
