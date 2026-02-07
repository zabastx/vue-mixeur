import type { FileInfo } from '@/composables/types/polyhaven'

export function isPolyHavenFileInfo(file: unknown): file is FileInfo {
	if (typeof file !== 'object' || file === null) {
		return false
	}

	return (
		'url' in file &&
		typeof file.url === 'string' &&
		'md5' in file &&
		typeof file.md5 === 'string' &&
		'size' in file &&
		typeof file.size === 'number'
	)
}
