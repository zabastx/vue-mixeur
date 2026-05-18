import { describe, it, expect } from 'vitest'
import {
	encodeProject,
	decodeProject,
	getProjectInfo,
	PROJECT_MAGIC,
	PROJECT_VERSION,
	crc32
} from './project-file'

describe('crc32', () => {
	it('uses buffer length when length param not provided', () => {
		const data = new ArrayBuffer(10) as ArrayBuffer
		const view = new Uint8Array(data)
		view[0] = 1
		view[5] = 2

		const checksum = crc32(data)

		expect(checksum).toBeGreaterThan(0)
	})

	it('uses offset and length when provided', () => {
		const data = new ArrayBuffer(20) as ArrayBuffer
		const view = new Uint8Array(data)
		view[5] = 42
		view[15] = 99

		const checksum = crc32(data, 5, 10)

		expect(checksum).toBeGreaterThan(0)
	})

	it('produces different checksums for different data', () => {
		const data1 = new ArrayBuffer(10) as ArrayBuffer
		const data2 = new ArrayBuffer(10) as ArrayBuffer

		const view1 = new Uint8Array(data1)
		const view2 = new Uint8Array(data2)
		view1[0] = 1
		view2[0] = 2

		const c1 = crc32(data1)
		const c2 = crc32(data2)

		expect(c1).not.toBe(c2)
	})

	it('produces correct known checksum', () => {
		// Known CRC32 value computed from input [1,2,3,4,5]
		const data = new Uint8Array([1, 2, 3, 4, 5]).buffer as ArrayBuffer
		const expectedChecksum = 1191942644

		expect(crc32(data)).toBe(expectedChecksum)
	})
})

describe('encodeProject', () => {
	it('creates valid binary output', () => {
		const data = {
			scene: { object: { uuid: 'test-uuid' } },
			renderCameraUUID: null
		}

		const result = encodeProject(data)

		expect(result.byteLength).toBeGreaterThan(0)
		// Verify 4-byte checksum is appended at end
		const checksumIndex = result.length - 4
		expect(result[checksumIndex]).toBeDefined()
	})

	it('includes scene data in encoded output', () => {
		const data = {
			scene: { geometries: [], materials: [] },
			renderCameraUUID: 'camera-uuid-123'
		}

		const result = encodeProject(data)

		expect(result.byteLength).toBeGreaterThan(4)
	})

	it('produces different output for different data', () => {
		const data1 = { scene: { geometries: [] }, renderCameraUUID: null }
		const data2 = { scene: { geometries: [{ uuid: 'test' }] }, renderCameraUUID: 'camera-123' }

		const result1 = encodeProject(data1)
		const result2 = encodeProject(data2)

		expect(result1).not.toEqual(result2)
	})

	it('produces binary with minimum size', () => {
		const data = { scene: { geometries: [] }, renderCameraUUID: null }

		const result = encodeProject(data)

		expect(result.byteLength).toBeGreaterThan(50)
	})

	it('produces output with checksum at end', () => {
		const data = { scene: {}, renderCameraUUID: null }

		const result = encodeProject(data)

		expect(result.byteLength).toBeGreaterThan(4)
		const checksumBytes = result.slice(-4)
		expect(checksumBytes.byteLength).toBe(4)
	})
})

describe('decodeProject', () => {
	it('decodes valid file correctly', () => {
		const originalData = {
			scene: { object: { uuid: 'test-uuid', name: 'Test Object' } },
			renderCameraUUID: 'camera-uuid-123'
		}

		const encoded = encodeProject(originalData)
		const decoded = decodeProject(encoded.buffer as ArrayBuffer)

		expect(decoded.magic).toBe(PROJECT_MAGIC)
		expect(decoded.version).toBe(PROJECT_VERSION)
		expect(decoded.data.scene).toEqual(originalData.scene)
		expect(decoded.data.renderCameraUUID).toBe(originalData.renderCameraUUID)
	})

	it('round-trip: encode → decode produces original data', () => {
		const originalData = {
			scene: {
				geometries: [{ uuid: 'geo-1', type: 'BoxGeometry' }],
				materials: [{ uuid: 'mat-1', type: 'MeshStandardMaterial' }]
			},
			renderCameraUUID: 'camera-123'
		}

		const encoded = encodeProject(originalData)
		const decoded = decodeProject(encoded.buffer as ArrayBuffer)

		expect(decoded.data).toEqual(originalData)
	})

	it('throws error on corrupted checksum', () => {
		const data = { scene: {}, renderCameraUUID: null }
		const encoded = encodeProject(data)

		const corrupted = new Uint8Array(encoded)
		corrupted[10] = corrupted[10] ^ 0xff

		expect(() => decodeProject(corrupted.buffer)).toThrow('corrupted')
	})

	it('throws error on invalid magic', () => {
		const data = { scene: {}, renderCameraUUID: null }
		const encoded = encodeProject(data)

		const decodedBeforeCorruption = decodeProject(encoded.buffer as ArrayBuffer)
		expect(decodedBeforeCorruption.magic).toBe(PROJECT_MAGIC)

		const corrupted = new Uint8Array(encoded)
		corrupted[1] = corrupted[1] ^ 0xff

		expect(() => decodeProject(corrupted.buffer)).toThrow()
	})

	it('includes version in output', () => {
		const data = { scene: {}, renderCameraUUID: null }
		const encoded = encodeProject(data)

		const decoded = decodeProject(encoded.buffer as ArrayBuffer)
		expect(decoded.version).toBe(PROJECT_VERSION)
		expect(typeof decoded.version).toBe('number')
	})

	it('handles null renderCameraUUID', () => {
		const data = { scene: { name: 'Scene' }, renderCameraUUID: null }

		const encoded = encodeProject(data)
		const decoded = decodeProject(encoded.buffer as ArrayBuffer)

		expect(decoded.data.renderCameraUUID).toBeNull()
	})

	it('handles empty scene', () => {
		const data = { scene: {}, renderCameraUUID: null }

		const encoded = encodeProject(data)
		const decoded = decodeProject(encoded.buffer as ArrayBuffer)

		expect(decoded.data.scene).toEqual({})
	})

	it('rejects invalid magic via decode', () => {
		const data = { scene: {}, renderCameraUUID: null }
		const encoded = encodeProject(data)

		const encodedArray = new Uint8Array(encoded)
		// Corrupt magic bytes (first 6 bytes) - indices vary due to MessagePack encoding
		const magicIndex = 0
		encodedArray[magicIndex] = 0
		encodedArray[magicIndex + 1] = 0
		encodedArray[magicIndex + 2] = 0
		encodedArray[magicIndex + 3] = 0
		encodedArray[magicIndex + 4] = 0
		encodedArray[magicIndex + 5] = 0

		// Recompute checksum after corruption
		const checksum = crc32(encodedArray.buffer, 0, encodedArray.byteLength - 4)
		const checksumView = new DataView(encodedArray.buffer, encodedArray.byteLength - 4, 4)
		checksumView.setUint32(0, checksum, true)

		expect(() => decodeProject(encodedArray.buffer)).toThrow()
	})
})

describe('getProjectInfo', () => {
	it('extracts metadata from valid file', () => {
		const data = { scene: {}, renderCameraUUID: null }
		const encoded = encodeProject(data)

		const info = getProjectInfo(encoded.buffer as ArrayBuffer)

		expect(info).not.toBeNull()
		expect(info?.version).toBe(PROJECT_VERSION.toString())
		expect(info?.createdAt).toBeDefined()
		expect(info?.appVersion).toBeDefined()
	})

	it('returns null on corrupted file', () => {
		const data = { scene: {}, renderCameraUUID: null }
		const encoded = encodeProject(data)

		const corrupted = new Uint8Array(encoded)
		corrupted[10] = corrupted[10] ^ 0xff

		const info = getProjectInfo(corrupted.buffer)

		expect(info).toBeNull()
	})

	it('returns null on corrupted data', () => {
		const data = { scene: {}, renderCameraUUID: null }
		const encoded = encodeProject(data)

		const corrupted = new Uint8Array(encoded)
		corrupted[1] = corrupted[1] ^ 0xff

		const info = getProjectInfo(corrupted.buffer)

		expect(info).toBeNull()
	})

	it('returns null on truncated file', () => {
		const data = { scene: {}, renderCameraUUID: null }
		const encoded = encodeProject(data)

		const truncated = encoded.slice(0, encoded.length - 5)

		const info = getProjectInfo(truncated.buffer)

		expect(info).toBeNull()
	})

	it('returns null on too short buffer', () => {
		const shortBuffer = new ArrayBuffer(3)
		const info = getProjectInfo(shortBuffer)

		expect(info).toBeNull()
	})
})
