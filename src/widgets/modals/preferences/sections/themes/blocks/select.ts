import type { ThemeInputField } from '../types'

export const ThemeFieldsSelect: ThemeInputField[] = [
	{
		key: '--color-ui-select-text',
		type: 'color',
		label: 'Text',
		transparent: true
	},
	{
		key: '--color-ui-select-text-selected',
		type: 'color',
		label: 'Text Selected',
		transparent: true
	},
	{
		key: '--color-ui-select-bg',
		type: 'color',
		label: 'Background',
		transparent: true
	},
	{
		key: '--color-ui-select-bg-selected',
		type: 'color',
		label: 'Background Selected',
		transparent: true
	},
	{
		key: '--color-ui-select-outline',
		type: 'color',
		label: 'Outline',
		transparent: true
	},
	{
		key: '--color-ui-select-menu-bg',
		type: 'color',
		label: 'Menu Background',
		transparent: true
	},
	{
		key: '--color-ui-select-menu-outline',
		type: 'color',
		label: 'Menu Outline',
		transparent: true
	},
	{
		key: '--ui-select-roundness',
		type: 'number',
		label: 'Roundness'
	},
	{
		key: '--ui-select-menu-roundness',
		type: 'number',
		label: 'Menu Roundness'
	}
]
