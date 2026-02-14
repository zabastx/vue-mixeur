import fs from 'fs'
import path from 'path'

export function getIconPaths(dir: string, prefix = ''): string[] {
	if (!fs.existsSync(dir)) {
		return []
	}

	const files = fs.readdirSync(dir, { withFileTypes: true })
	const icons: string[] = []

	for (const file of files) {
		const filePath = path.join(dir, file.name)

		if (file.isDirectory()) {
			const newPrefix = prefix ? `${prefix}/${file.name}` : file.name
			icons.push(...getIconPaths(filePath, newPrefix))
		} else if (file.name.endsWith('.svg')) {
			const iconName = file.name.replace('.svg', '')
			icons.push(prefix ? `${prefix}/${iconName}` : iconName)
		}
	}

	return icons.sort()
}

export function generateIconTypes(iconsDir: string, outputPath: string): void {
	const iconPaths = getIconPaths(iconsDir)

	if (iconPaths.length === 0) {
		console.warn('⚠️  No icons found in', iconsDir)
		return
	}

	const typeContent = `// Auto-generated file. Do not edit manually.
// Generated at: ${new Date().toISOString()}
// Total icons: ${iconPaths.length}

declare global {
	type MxIconName = 
${iconPaths.map((name) => `		|	'${name}'`).join('\n')}
}

export {}
`
	// export const ICON_NAMES = [
	// ${iconPaths.map((name) => `  '${name}',`).join('\n')}
	// ] as const

	// // Runtime validation helper
	// export function isValidIcon(name: string): name is MxIconName {
	//   return ICON_NAMES.includes(name as MxIconName)
	// }

	const dir = path.dirname(outputPath)
	if (!fs.existsSync(dir)) {
		fs.mkdirSync(dir, { recursive: true })
	}

	fs.writeFileSync(outputPath, typeContent)
	console.log(`✅ Generated types for ${iconPaths.length} icons`)
}
