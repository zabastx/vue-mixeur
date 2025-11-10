/**
 * TypeScript type definitions for PolyHaven API
 * Based on the OpenAPI specification at https://api.polyhaven.com
 */

/**
 * Asset types available on PolyHaven
 */
export type AssetType = 'hdris' | 'textures' | 'models'

/**
 * Base properties common to all asset types
 */
export interface BaseAsset {
	/** The human-readable/display name */
	name: string
	/** The asset type. HDRIs = 0, textures = 1, models = 2 */
	type: 0 | 1 | 2
	/** The epoch timestamp in seconds of when this asset was published */
	date_published: number
	/** The number of times this asset was downloaded */
	download_count: number
	/** A SHA1 hash of the files object, which will change whenever the files are updated */
	files_hash: string
	/** Who created this asset, and what they did */
	authors: Record<string, string>
	/** Whether or not this asset was donated free of charge */
	donated?: boolean | null
	/** A string array of categories that this asset belongs to */
	categories: string[]
	/** A string array of tags for this asset to help with search matches */
	tags: string[]
	/** The highest resolution available for this asset, in pixels [width, height] */
	max_resolution: [number, number]
	/** The URL of the preview image thumbnail for this asset */
	thumbnail_url: string
}

/**
 * HDRI-specific asset properties
 */
export interface HDRIAsset extends BaseAsset {
	type: 0
	/** The whitebalance in Kelvin that this HDRI was shot at */
	whitebalance?: number | null
	/** Whether there are backplates available for this HDRI */
	backplates?: boolean | null
	/** The number of exposure brackets captured when shooting this HDRI */
	evs_cap: number
	/** Decimal lat/lon GPS coordinates */
	coords?: [number, number] | null
	/** Legacy epoch timestamp of when this HDRI was taken */
	date_taken?: number
}

/**
 * Texture-specific asset properties
 */
export interface TextureAsset extends BaseAsset {
	type: 1
	/** Dimensions of this asset on each axis in millimeters [width, height] */
	dimensions: [number, number]
}

/**
 * Model-specific asset properties
 */
export interface ModelAsset extends BaseAsset {
	type: 2
	/** A list of LOD triangle counts in order */
	lods?: number[]
}

/**
 * Union type for all asset types
 */
export type Asset = HDRIAsset | TextureAsset | ModelAsset

/**
 * Response from /assets endpoint - a record of asset IDs to asset data
 */
export type AssetsResponse = Record<string, Asset>

/**
 * Asset with its ID included
 */
export type AssetWithId = Asset & {
	id: string
}

/**
 * File information
 */
export interface FileInfo {
	/** Direct URL to download this file */
	url: string
	/** MD5 checksum for verifying file integrity */
	md5: string
	/** Size of the file in bytes */
	size: number
}

/**
 * File with includes (for models and textures that depend on other files)
 */
export interface FileWithIncludes extends FileInfo {
	/** A list of files that this file depends on */
	include?: Record<string, FileInfo>
}

/**
 * HDRI file structure
 */
export interface HDRIFiles {
	/** HDRI files organized by resolution and format */
	hdri: Record<string, Record<string, FileInfo>>
	/** Optional backplate images */
	backplates?: Record<string, Record<string, FileInfo>> | null
	/** Optional color chart */
	colorchart?: FileInfo | null
	/** Optional tonemapped preview */
	tonemapped?: FileInfo | null
}

/**
 * Texture file structure
 */
export interface TextureFiles {
	/** Blender files */
	blend?: Record<string, { blend: FileWithIncludes }>
	/** glTF files */
	gltf?: Record<string, { gltf: FileWithIncludes }>
	/** MaterialX files */
	mtlx?: Record<string, { mtlx: FileWithIncludes }>
	/** Texture maps organized by map type, resolution, and format */
	[mapType: string]: Record<string, Record<string, FileInfo>> | undefined
}

/**
 * Model file structure
 */
export interface ModelFiles {
	/** Blender files */
	blend?: Record<string, { blend: FileWithIncludes }>
	/** glTF files */
	gltf?: Record<string, { gltf: FileWithIncludes }>
	/** FBX files */
	fbx?: Record<string, { fbx: FileWithIncludes }>
	/** USD files */
	usd?: Record<string, { usd: FileWithIncludes }>
	/** Texture maps organized by map type, resolution, and format */
	[mapType: string]: Record<string, Record<string, FileInfo>> | undefined
}

/**
 * Union type for all file structures
 */
export type AssetFiles = HDRIFiles | TextureFiles | ModelFiles

/**
 * Response from /categories endpoint
 */
export type CategoryResponse = Record<string, number>

/**
 * Author information
 */
export interface Author {
	/** The author's full name */
	name: string
	/** The author's preferred link to their portfolio */
	link?: string | null
	/** Email address of the author */
	email?: string | null
	/** Donation info (link or PayPal email prefixed with 'paypal:') */
	donate?: string | null
}

/**
 * Options for filtering assets
 */
export interface AssetFilterOptions {
	/** Filter by asset type */
	type?: AssetType | 'all'
	/** Filter by categories (comma-separated) */
	categories?: string[]
}

/**
 * Pagination options
 */
export interface PaginationOptions {
	/** Number of items per page */
	pageSize?: number
	/** Current page number (1-based) */
	currentPage?: number
}
