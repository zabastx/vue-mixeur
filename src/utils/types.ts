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
