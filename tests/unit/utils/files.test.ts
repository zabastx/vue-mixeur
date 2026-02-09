import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { downloadFile, uploadFile } from '@/utils/files'

describe('downloadFile', () => {
	let mockAnchor: HTMLAnchorElement
	let createElementSpy: ReturnType<typeof vi.spyOn>
	let createObjectURLSpy: ReturnType<typeof vi.spyOn>
	let revokeObjectURLSpy: ReturnType<typeof vi.spyOn>
	let appendChildSpy: ReturnType<typeof vi.spyOn>
	let removeChildSpy: ReturnType<typeof vi.spyOn>

	beforeEach(() => {
		vi.useFakeTimers()

		mockAnchor = {
			click: vi.fn(),
			href: '',
			download: '',
			style: { display: '' },
			remove: vi.fn()
		} as unknown as HTMLAnchorElement

		createElementSpy = vi.spyOn(document, 'createElement').mockReturnValue(mockAnchor)
		createObjectURLSpy = vi
			.spyOn(URL, 'createObjectURL')
			.mockReturnValue('blob:http://test/blob-url')
		revokeObjectURLSpy = vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => undefined)
		appendChildSpy = vi.spyOn(document.body, 'appendChild').mockImplementation(() => mockAnchor)
		removeChildSpy = vi.spyOn(document.body, 'removeChild').mockImplementation(() => mockAnchor)
	})

	afterEach(() => {
		vi.useRealTimers()
		vi.restoreAllMocks()
	})

	it('should download Blob successfully', () => {
		const blob = new Blob(['test content'], { type: 'text/plain' })
		const result = downloadFile(blob, 'test.txt')

		expect(result.success).toBe(true)
		expect(result.error).toBeNull()
		expect(createElementSpy).toHaveBeenCalledWith('a')
		expect(createObjectURLSpy).toHaveBeenCalled()
		expect(mockAnchor.download).toBe('test.txt')
		expect(mockAnchor.href).toBe('blob:http://test/blob-url')
		expect(mockAnchor.style.display).toBe('none')
		expect(appendChildSpy).toHaveBeenCalled()
		expect(mockAnchor.click).toHaveBeenCalled()

		// Need to advance timers for revokeObjectURL to be called
		vi.advanceTimersByTime(100)
		expect(revokeObjectURLSpy).toHaveBeenCalledWith('blob:http://test/blob-url')
	})

	it('should download ArrayBuffer successfully', () => {
		const arrayBuffer = new ArrayBuffer(8)
		const result = downloadFile(arrayBuffer, 'data.bin')

		expect(result.success).toBe(true)
		expect(result.error).toBeNull()
		expect(createObjectURLSpy).toHaveBeenCalled()

		vi.advanceTimersByTime(100)
		expect(revokeObjectURLSpy).toHaveBeenCalled()
	})

	it('should use custom mimeType when provided', () => {
		const blob = new Blob(['test'], { type: 'text/plain' })
		downloadFile(blob, 'test.pdf', { mimeType: 'application/pdf' })

		expect(createObjectURLSpy).toHaveBeenCalled()
	})

	it('should use default mimeType when not provided', () => {
		const arrayBuffer = new ArrayBuffer(8)
		downloadFile(arrayBuffer, 'test.dat')

		expect(createObjectURLSpy).toHaveBeenCalled()
	})

	it('should clean up anchor element after download', () => {
		const blob = new Blob(['test'], { type: 'text/plain' })
		downloadFile(blob, 'test.txt')

		vi.advanceTimersByTime(100)

		expect(removeChildSpy).toHaveBeenCalledWith(mockAnchor)
		expect(revokeObjectURLSpy).toHaveBeenCalledWith('blob:http://test/blob-url')
	})

	it('should handle errors gracefully', () => {
		createObjectURLSpy.mockImplementation(() => {
			throw new Error('URL creation failed')
		})

		const blob = new Blob(['test'], { type: 'text/plain' })
		const result = downloadFile(blob, 'test.txt')

		expect(result.success).toBe(false)
		expect(result.error).not.toBeNull()
		expect(result.error?.message).toBe('URL creation failed')
	})
})

describe('uploadFile', () => {
	let createElementSpy: ReturnType<typeof vi.spyOn>
	let createObjectURLSpy: ReturnType<typeof vi.spyOn>

	beforeEach(() => {
		vi.useFakeTimers()

		createObjectURLSpy = vi
			.spyOn(URL, 'createObjectURL')
			.mockReturnValue('blob:http://test/blob-url')

		createElementSpy = vi.spyOn(document, 'createElement').mockReturnValue({
			type: 'file',
			accept: '',
			style: { display: '' },
			click: vi.fn(),
			remove: vi.fn()
		} as unknown as HTMLInputElement)

		vi.spyOn(document.body, 'appendChild').mockReturnValue(document.createElement('div'))
		vi.spyOn(document.body, 'removeChild').mockReturnValue(document.createElement('div'))
	})

	afterEach(() => {
		vi.useRealTimers()
		vi.restoreAllMocks()
	})

	it('should upload file successfully when file is selected', async () => {
		const mockFile = new File(['test content'], 'test.txt', { type: 'text/plain' })

		const input = {
			type: 'file',
			accept: '',
			style: { display: '' },
			click: vi.fn(),
			remove: vi.fn(),
			files: [mockFile] as unknown as FileList,
			addEventListener: vi.fn((event, handler) => {
				if (event === 'change') {
					handler({ target: { files: [mockFile] } })
				}
			})
		} as unknown as HTMLInputElement

		createElementSpy = vi.spyOn(document, 'createElement').mockReturnValue(input)

		const result = await uploadFile()

		expect(result.error).toBeNull()
		expect(result.data).not.toBeNull()
		expect(result.data?.filename).toBe('test.txt')
		expect(result.data?.url).toBe('blob:http://test/blob-url')
		expect(typeof result.data?.cleanup).toBe('function')
		expect(createElementSpy).toHaveBeenCalledWith('input')
		if (result.data) {
			result.data.cleanup()
		}
	})

	it('should return null data when no file is selected', async () => {
		const input = {
			type: 'file',
			accept: '',
			style: { display: '' },
			click: vi.fn(),
			remove: vi.fn(),
			files: null,
			addEventListener: vi.fn((event, handler) => {
				if (event === 'change') {
					handler({ target: { files: null } })
				}
			})
		} as unknown as HTMLInputElement

		createElementSpy = vi.spyOn(document, 'createElement').mockReturnValue(input)

		const result = await uploadFile()

		expect(result.data).toBeNull()
		expect(result.error).toBeNull()
	})

	it('should set accept attribute when provided', async () => {
		const mockFile = new File([''], 'test.png', { type: 'image/png' })

		const input = {
			type: 'file',
			accept: '',
			style: { display: '' },
			click: vi.fn(),
			remove: vi.fn(),
			files: [mockFile] as unknown as FileList,
			addEventListener: vi.fn((event, handler) => {
				if (event === 'change') {
					handler({ target: { files: [mockFile] } })
				}
			})
		} as unknown as HTMLInputElement

		createElementSpy = vi.spyOn(document, 'createElement').mockReturnValue(input)

		await uploadFile('image/*')

		expect(createElementSpy).toHaveBeenCalledWith('input')
	})

	it('should handle errors gracefully', async () => {
		createObjectURLSpy.mockImplementation(() => {
			throw new Error('URL creation failed')
		})

		const mockFile = new File(['test'], 'test.txt', { type: 'text/plain' })

		const input = {
			type: 'file',
			accept: '',
			style: { display: '' },
			click: vi.fn(),
			remove: vi.fn(),
			files: [mockFile] as unknown as FileList,
			addEventListener: vi.fn((event, handler) => {
				if (event === 'change') {
					handler({ target: { files: [mockFile] } })
				}
			})
		} as unknown as HTMLInputElement

		createElementSpy = vi.spyOn(document, 'createElement').mockReturnValue(input)

		const result = await uploadFile()

		expect(result.data).toBeNull()
		expect(result.error).not.toBeNull()
		expect(result.error?.message).toBe('URL creation failed')
	})
})
