export type ThemeVar = {
	label: string
	key: string
	type: 'color' | 'number'
}

export type ParsedTheme = Record<string, ThemeVar[]>

const HEX_COLOR = /^#([0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/
const NUMBER = /^-?(\d+\.?\d*|\.\d+)$/

function isAccepted(value: string): boolean {
	return HEX_COLOR.test(value) || NUMBER.test(value)
}

function toLabel(key: string, prefix: string): string {
	return key
		.replace(/^--/, '')
		.replace(/^color-?/, '')
		.replace(new RegExp(`^${prefix}-?`), '')
		.split('-')
		.map((w) => w.charAt(0).toUpperCase() + w.slice(1))
		.join(' ')
}

function extractThemeBlock(css: string): string | null {
	const start = css.indexOf('@theme')
	if (start === -1) return null
	let depth = 0,
		open = -1
	for (let i = start; i < css.length; i++) {
		if (css[i] === '{') {
			if (depth++ === 0) open = i
		} else if (css[i] === '}' && --depth === 0) return css.slice(open + 1, i)
	}
	return null
}

export function parseTheme(css: string, prefix = ''): ParsedTheme {
	const block = extractThemeBlock(css) ?? css
	const result: ParsedTheme = {}
	let group = 'Ungrouped'

	for (const rawLine of block.split('\n')) {
		const line = rawLine.trim()
		if (!line) continue

		const commentMatch = line.match(/^\/\*\s*(.+?)\s*\*\/$/)
		if (commentMatch) {
			group = commentMatch[1]
			continue
		}

		const varMatch = line.match(/^(-{2}[\w-]+)\s*:\s*(.+?);?\s*$/)
		if (!varMatch) continue

		const [, key, value] = varMatch
		if (!isAccepted(value.trim())) continue
		const type = HEX_COLOR.test(value.trim()) ? 'color' : 'number'
		;(result[group] ??= []).push({ key, label: toLabel(key, prefix), type })
	}

	return result
}
