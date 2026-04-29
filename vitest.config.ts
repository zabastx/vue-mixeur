import { mergeConfig, defineConfig } from 'vitest/config'
import viteConfig from './vite.config'

export default mergeConfig(
	viteConfig,
	defineConfig({
		test: {
			environment: 'happy-dom',
			coverage: {
				enabled: true,
				reporter: ['text', 'json', 'html'],
				exclude: ['**/assets/icons/**/*']
			},
			setupFiles: ['src/app/test/setup.ts'],
			include: ['src/**/*.test.ts']
		}
	})
)
