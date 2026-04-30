import type { GizmoOptions } from 'three-viewport-gizmo'

export function getGizmoConfig(): GizmoOptions {
	const rootStyle = getComputedStyle(document.documentElement)
	const colorX = rootStyle.getPropertyValue('--color-axis-x') || undefined
	const colorY = rootStyle.getPropertyValue('--color-axis-y') || undefined
	const colorZ = rootStyle.getPropertyValue('--color-axis-z') || undefined

	return {
		container: '.gizmo-wrapper',
		className: 'gizmo',
		size: 100,
		placement: 'top-right',
		lineWidth: 3,
		resolution: 128,
		x: {
			color: colorX,
			hover: {
				labelColor: '#fff',
				color: colorX
			}
		},
		y: {
			color: colorY,
			hover: {
				labelColor: '#fff',
				color: colorY
			}
		},
		z: {
			color: colorZ,
			hover: {
				labelColor: '#fff',
				color: colorZ
			}
		}
	}
}
