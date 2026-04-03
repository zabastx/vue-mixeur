import { generateIconTypes } from './icon-types-generator.js'
import path from 'node:path'

const args = process.argv.slice(2)
const iconsDir = args[0] ?? 'src/assets/icons'
const outputPath = args[1] ?? 'src/icons.d.ts'

const resolvedIconsDir = path.resolve(process.cwd(), iconsDir)
const resolvedOutputPath = path.resolve(process.cwd(), outputPath)

console.log(`🎨 Generating icon types...`)
generateIconTypes(resolvedIconsDir, resolvedOutputPath)
