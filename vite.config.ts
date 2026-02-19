import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import Components from 'unplugin-vue-components/vite'
import RekaResolver from 'reka-ui/resolver'
import svgLoader from 'vite-svg-loader'
import { iconTypesPlugin } from './plugins/vite-plugin-icon-types'

// https://vite.dev/config/
export default defineConfig({
	plugins: [
		vue(),
		tailwindcss(),
		Components({
			dts: 'src/components.d.ts',
			resolvers: [RekaResolver()]
		}),
		svgLoader(),
		iconTypesPlugin()
	],
	resolve: {
		alias: {
			'@': fileURLToPath(new URL('./src', import.meta.url))
		}
	},
	build: {
		rollupOptions: {
			output: {
				manualChunks(id) {
					if (id.includes('node_modules/three/build')) return 'three'
					if (id.includes('assets/icons')) return 'icons'
				}
			}
		}
	}
})
