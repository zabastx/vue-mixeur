import { test, expect } from '@playwright/test'
import { fileURLToPath } from 'node:url'

test.describe('3D Viewport', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/')
		await page.waitForSelector('[data-testid="viewport-canvas"]', { state: 'attached' })
	})

	test('Canvas is rendered', async ({ page }) => {
		const canvas = page.locator('[data-testid="viewport-canvas"]')
		await expect(canvas).toBeVisible()
	})

	test('Toolbar keyboard shortcuts work', async ({ page }) => {
		const canvas = page.locator('[data-testid="viewport-canvas"]')

		const translateBtn = page.locator('[data-testid="toolbar-btn-translate"]')
		const rotateBtn = page.locator('[data-testid="toolbar-btn-rotate"]')
		const scaleBtn = page.locator('[data-testid="toolbar-btn-scale"]')

		await canvas.hover()
		await canvas.press('g')
		await expect(translateBtn).toHaveAttribute('data-active', 'true')
		await expect(rotateBtn).toHaveAttribute('data-active', 'false')
		await expect(scaleBtn).toHaveAttribute('data-active', 'false')

		await canvas.hover()
		await canvas.press('r')
		await expect(translateBtn).toHaveAttribute('data-active', 'false')
		await expect(rotateBtn).toHaveAttribute('data-active', 'true')
		await expect(scaleBtn).toHaveAttribute('data-active', 'false')

		await canvas.hover()
		await canvas.press('s')
		await expect(translateBtn).toHaveAttribute('data-active', 'false')
		await expect(rotateBtn).toHaveAttribute('data-active', 'false')
		await expect(scaleBtn).toHaveAttribute('data-active', 'true')
	})

	test('object selection via click', async ({ page }) => {
		const canvas = page.locator('[data-testid="viewport-canvas"]')
		const box = await canvas.boundingBox()

		expect(box).not.toBeNull()

		if (!box) return

		const x = box.x + box.width / 2
		const y = box.y + box.height / 2

		await canvas.click({ position: { x, y } })

		const selectedItem = page.locator('[data-testid="outliner-selected"]')
		await expect(selectedItem).toBeAttached()
	})

	test('import model flow', async ({ page }) => {
		await page.click('text=File')
		await page.hover('text=Import')

		const [fileChooser] = await Promise.all([
			page.waitForEvent('filechooser'),
			page.click('text=GLTF')
		])

		const filePath = fileURLToPath(new URL('./files/test-gltf.glb', import.meta.url))

		await fileChooser.setFiles(filePath)

		await expect(page.locator('[data-testid="loading-progress"]')).toBeVisible()

		await page.waitForSelector('[data-testid="loading-progress"]', { state: 'detached' })

		await expect(page.locator('text=test-gltf')).toBeVisible()
	})
})
