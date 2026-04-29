import type { ThemeInputField } from '../types'

export const ThemeFieldsButton: ThemeInputField[] = [
	{
		key: '--color-ui-btn-text',
		type: 'color',
		label: 'Text',
		transparent: true
	},
	{
		key: '--color-ui-btn-bg',
		type: 'color',
		label: 'Background',
		transparent: true
	},
	{
		key: '--color-ui-btn-bg-highlight',
		type: 'color',
		label: 'Background Highlighted',
		transparent: true
	},
	{
		key: '--color-ui-btn-outline',
		type: 'color',
		label: 'Outline',
		transparent: true
	},
	{
		key: '--ui-btn-roundness',
		type: 'number',
		label: 'Roundness'
	}
]
