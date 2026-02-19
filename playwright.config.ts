import { defineConfig, devices } from '@playwright/test'

/**
 * Playwright configuration for Vue Mixeur E2E tests
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
	testDir: './tests/e2e',
	fullyParallel: true,
	forbidOnly: !!process.env.CI,
	retries: process.env.CI ? 2 : 0,
	workers: process.env.CI ? 1 : 3,
	reporter: 'html',
	timeout: 60 * 1000,

	use: {
		baseURL: process.env.CI ? 'http://localhost:4173' : 'http://localhost:5173',
		trace: 'on-first-retry',
		screenshot: 'only-on-failure'
	},

	projects: process.env.CI
		? [
				{
					name: 'chromium',
					use: {
						...devices['Desktop Chrome'],
						launchOptions: {
							args: ['--use-gl=swiftshader', '--no-sandbox']
						}
					}
				},
				{ name: 'webkit', use: devices['Desktop Safari'] }
			]
		: [{ name: 'chromium', use: devices['Desktop Chrome'] }],

	webServer: {
		command: process.env.CI ? 'bun run preview' : 'bun run dev',
		url: process.env.CI ? 'http://localhost:4173' : 'http://localhost:5173',
		reuseExistingServer: !process.env.CI,
		timeout: 2 * 60 * 1000
	}
})
