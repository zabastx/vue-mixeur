import type { MxTooltipContent } from '@/shared/lib/types'

export type GeometryField<T> = {
	key: keyof T
	label: string
	type: 'integer' | 'float' | 'angle' | 'boolean'
	min?: number
	max?: number
	step?: number
	tooltip?: MxTooltipContent
}
