export type ThemeInputField = ThemeInputFieldColor | ThemeInputFieldNumber

type ThemeInputFieldColor = {
	type: 'color'
	key: string
	label: string
	transparent?: boolean
}

type ThemeInputFieldNumber = {
	type: 'number'
	key: string
	label: string
}
