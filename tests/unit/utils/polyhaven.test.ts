import { describe, expect, it } from 'vitest'
import { isPolyHavenFileInfo } from '@/utils/polyhaven'
import type { FileInfo } from '@/composables/types/polyhaven'

describe('isPolyHavenFileInfo', () => {
	it('should return true for valid FileInfo object', () => {
		const validFileInfo: FileInfo = {
			url: 'https://example.com/file.zip',
			md5: 'd41d8cd98f00b204e9800998ecf8427e',
			size: 1024
		}

		expect(isPolyHavenFileInfo(validFileInfo)).toBe(true)
	})

	it('should return true for FileInfo with empty strings', () => {
		const fileInfoWithEmptyStrings: FileInfo = {
			url: '',
			md5: '',
			size: 0
		}

		expect(isPolyHavenFileInfo(fileInfoWithEmptyStrings)).toBe(true)
	})

	it('should return false for null', () => {
		expect(isPolyHavenFileInfo(null)).toBe(false)
	})

	it('should return false for undefined', () => {
		expect(isPolyHavenFileInfo(undefined)).toBe(false)
	})

	it('should return false for a string', () => {
		expect(isPolyHavenFileInfo('string')).toBe(false)
	})

	it('should return false for a number', () => {
		expect(isPolyHavenFileInfo(123)).toBe(false)
	})

	it('should return false for a boolean', () => {
		expect(isPolyHavenFileInfo(true)).toBe(false)
	})

	it('should return false for an array', () => {
		expect(isPolyHavenFileInfo([])).toBe(false)
	})

	it('should return false for an empty object', () => {
		expect(isPolyHavenFileInfo({})).toBe(false)
	})

	it('should return false for object missing url property', () => {
		const invalidFileInfo = {
			md5: 'd41d8cd98f00b204e9800998ecf8427e',
			size: 1024
		}

		expect(isPolyHavenFileInfo(invalidFileInfo)).toBe(false)
	})

	it('should return false for object missing md5 property', () => {
		const invalidFileInfo = {
			url: 'https://example.com/file.zip',
			size: 1024
		}

		expect(isPolyHavenFileInfo(invalidFileInfo)).toBe(false)
	})

	it('should return false for object missing size property', () => {
		const invalidFileInfo = {
			url: 'https://example.com/file.zip',
			md5: 'd41d8cd98f00b204e9800998ecf8427e'
		}

		expect(isPolyHavenFileInfo(invalidFileInfo)).toBe(false)
	})

	it('should return false for object with url as number', () => {
		const invalidFileInfo = {
			url: 123,
			md5: 'd41d8cd98f00b204e9800998ecf8427e',
			size: 1024
		}

		expect(isPolyHavenFileInfo(invalidFileInfo)).toBe(false)
	})

	it('should return false for object with url as null', () => {
		const invalidFileInfo = {
			url: null,
			md5: 'd41d8cd98f00b204e9800998ecf8427e',
			size: 1024
		}

		expect(isPolyHavenFileInfo(invalidFileInfo)).toBe(false)
	})

	it('should return false for object with md5 as number', () => {
		const invalidFileInfo = {
			url: 'https://example.com/file.zip',
			md5: 123,
			size: 1024
		}

		expect(isPolyHavenFileInfo(invalidFileInfo)).toBe(false)
	})

	it('should return false for object with md5 as null', () => {
		const invalidFileInfo = {
			url: 'https://example.com/file.zip',
			md5: null,
			size: 1024
		}

		expect(isPolyHavenFileInfo(invalidFileInfo)).toBe(false)
	})

	it('should return false for object with size as string', () => {
		const invalidFileInfo = {
			url: 'https://example.com/file.zip',
			md5: 'd41d8cd98f00b204e9800998ecf8427e',
			size: '1024'
		}

		expect(isPolyHavenFileInfo(invalidFileInfo)).toBe(false)
	})

	it('should return false for object with size as null', () => {
		const invalidFileInfo = {
			url: 'https://example.com/file.zip',
			md5: 'd41d8cd98f00b204e9800998ecf8427e',
			size: null
		}

		expect(isPolyHavenFileInfo(invalidFileInfo)).toBe(false)
	})

	it('should return true for object with extra properties', () => {
		const invalidFileInfo = {
			url: 'https://example.com/file.zip',
			md5: 'd41d8cd98f00b204e9800998ecf8427e',
			size: 1024,
			extraProperty: 'value'
		}

		expect(isPolyHavenFileInfo(invalidFileInfo)).toBe(true)
	})

	it('should return false for object with all properties wrong type', () => {
		const invalidFileInfo = {
			url: 123,
			md5: 456,
			size: '789'
		}

		expect(isPolyHavenFileInfo(invalidFileInfo)).toBe(false)
	})
})
