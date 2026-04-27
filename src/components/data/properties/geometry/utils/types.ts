import type { MxTooltipContent } from '@/utils/types'

export type GeometryField<T> = {
	key: keyof T
	label: string
	type: 'integer' | 'float' | 'angle' | 'boolean'
	min?: number
	max?: number
	step?: number
	tooltip?: MxTooltipContent
}
