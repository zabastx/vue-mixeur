import { mergeConfig, defineConfig, configDefaults } from 'vitest/config'
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
			setupFiles: ['./tests/setup.ts'],
			include: ['./tests/**/*.test.ts'],
			exclude: [...configDefaults.exclude, '**/e2e/**']
		}
	})
)
