export interface KeymapTransformMode {
	translate: string
	rotate: string
	scale: string
}

export interface KeymapTransformAxis {
	x: string
	y: string
	z: string
	clear: string
}

export interface KeymapTransform {
	mode: KeymapTransformMode
	axis: KeymapTransformAxis
	cancel: string
}

export interface KeymapView {
	front: string
	right: string
	top: string
}

export interface Keymaps {
	transform: KeymapTransform
	view: KeymapView
}

export const defaultKeymaps: Keymaps = {
	transform: {
		mode: {
			translate: 'KeyG',
			rotate: 'KeyR',
			scale: 'KeyS'
		},
		axis: {
			x: 'KeyX',
			y: 'KeyY',
			z: 'KeyZ',
			clear: 'KeyC'
		},
		cancel: 'Escape'
	},
	view: {
		front: 'Numpad1',
		right: 'Numpad3',
		top: 'Numpad7'
	}
}

export const keyCodeToTransformMode: Record<string, keyof KeymapTransformMode> = Object.entries(
	defaultKeymaps.transform.mode
).reduce(
	(acc, [mode, code]) => {
		acc[code] = mode as keyof KeymapTransformMode
		return acc
	},
	{} as Record<string, keyof KeymapTransformMode>
)

export const keyCodeToTransformAxis: Record<string, keyof KeymapTransformAxis> = Object.entries(
	defaultKeymaps.transform.axis
).reduce(
	(acc, [axis, code]) => {
		acc[code] = axis as keyof KeymapTransformAxis
		return acc
	},
	{} as Record<string, keyof KeymapTransformAxis>
)

export const keyCodeToViewDirection: Record<string, 'front' | 'right' | 'top'> = {
	[defaultKeymaps.view.front]: 'front',
	[defaultKeymaps.view.right]: 'right',
	[defaultKeymaps.view.top]: 'top'
}
