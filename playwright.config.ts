import { defineConfig, devices } from '@playwright/test'

/**
 * Playwright configuration for Vue Mixeur E2E tests
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
	testDir: './tests/e2e',
	fullyParallel: true,
	forbidOnly: !!process.env.CI,
	retries: process.env.CI ? 1 : 0,
	workers: process.env.CI ? 1 : 3,
	reporter: 'html',

	use: {
		baseURL: process.env.CI ? 'http://localhost:4173' : 'http://localhost:5173',
		trace: 'on-first-retry',
		screenshot: 'only-on-failure'
	},

	projects: [
		{
			name: 'chromium',
			use: {
				...devices['Desktop Chrome'],
				launchOptions: {
					args: [
						'--use-gl=angle',
						'--disable-gpu-sandbox',
						...(process.env.CI ? ['--disable-gpu', '--no-sandbox', '--disable-setuid-sandbox'] : [])
					]
				}
			}
		},
		{
			name: 'firefox',
			use: devices['Desktop Firefox']
		},
		{
			name: 'webkit',
			use: devices['Desktop Safari']
		}
	],

	webServer: {
		command: process.env.CI ? 'bun run preview' : 'bun run dev',
		url: process.env.CI ? 'http://localhost:4173' : 'http://localhost:5173',
		reuseExistingServer: !process.env.CI,
		timeout: 2 * 60 * 1000
	}
})
