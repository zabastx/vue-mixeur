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

	use: {
		baseURL: process.env.CI ? 'http://localhost:4173' : 'http://localhost:5173',
		trace: 'on-first-retry',
		screenshot: 'only-on-failure'
	},

	projects: process.env.CI
		? [
				{ name: 'chromium', use: devices['Desktop Chrome'] },
				{ name: 'firefox', use: devices['Desktop Firefox'] },
				{ name: 'webkit', use: devices['Desktop Safari'] }
			]
		: [{ name: 'chromium', use: devices['Desktop Chrome'] }],

	webServer: {
		command: process.env.CI ? 'bun run preview' : 'bun run dev',
		url: process.env.CI ? 'http://localhost:4173' : 'http://localhost:5173',
		reuseExistingServer: !process.env.CI,
		timeout: 120000
	}
})
