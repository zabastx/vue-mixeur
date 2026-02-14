import type { Plugin } from 'vite'
import path from 'path'
import { generateIconTypes } from './icon-types-generator.js'

export interface IconTypesPluginOptions {
	iconsDir?: string
	outputPath?: string
	watch?: boolean
}

export function iconTypesPlugin(options: IconTypesPluginOptions = {}): Plugin {
	const { iconsDir = 'src/assets/icons', outputPath = 'src/icons.d.ts', watch = true } = options

	let resolvedIconsDir: string
	let resolvedOutputPath: string

	return {
		name: 'vite-plugin-icon-types',

		configResolved(config) {
			resolvedIconsDir = path.resolve(config.root, iconsDir)
			resolvedOutputPath = path.resolve(config.root, outputPath)
		},

		buildStart() {
			generateIconTypes(resolvedIconsDir, resolvedOutputPath)
		},

		configureServer(server) {
			if (!watch) return

			server.watcher.add(resolvedIconsDir)

			const regenerate = (file: string) => {
				if (file.startsWith(resolvedIconsDir) && file.endsWith('.svg')) {
					console.log('🔄 Icon changed, regenerating types...')
					generateIconTypes(resolvedIconsDir, resolvedOutputPath)
				}
			}

			server.watcher.on('add', regenerate)
			server.watcher.on('unlink', regenerate)
		}
	}
}
