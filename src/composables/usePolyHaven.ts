import { ref, computed, watch } from 'vue'
import { createFetch } from '@vueuse/core'
import { useToast } from './useToast'
import type {
	AssetType,
	Asset,
	AssetsResponse,
	AssetWithId,
	AssetFiles,
	CategoryResponse,
	HDRIAsset,
	TextureAsset,
	ModelAsset
} from './types/polyhaven'

/**
 * Options for configuring the PolyHaven composable
 */
export interface UsePolyHavenOptions {
	/** Filter by asset type (default: 'all') */
	type?: AssetType | 'all'
	/** Filter by categories */
	categories?: string[]
	/** Automatically fetch assets on initialization (default: true) */
	autoFetch?: boolean
	/** Number of items per page (default: 20) */
	pageSize?: number
}

/**
 * Create a pre-configured fetch instance for PolyHaven API
 */
const usePolyHavenFetch = createFetch({
	baseUrl: 'https://api.polyhaven.com',
	options: {
		async beforeFetch({ options }) {
			options.headers = {
				...options.headers,
				Accept: 'application/json'
			}
			return { options }
		}
	},
	fetchOptions: {
		mode: 'cors'
	}
})

/**
 * Vue composable for interacting with the PolyHaven API
 *
 * @example
 * ```typescript
 * const {
 *   paginatedAssets,
 *   isLoading,
 *   error,
 *   currentPage,
 *   totalPages,
 *   nextPage,
 *   prevPage,
 *   fetchAssetInfo,
 *   fetchAssetFiles
 * } = usePolyHaven({
 *   type: 'textures',
 *   categories: ['brick'],
 *   pageSize: 20
 * })
 * ```
 */
export function usePolyHaven(options: UsePolyHavenOptions = {}) {
	const {
		type: initialType = 'all',
		categories: initialCategories = [],
		autoFetch = true,
		pageSize: initialPageSize = 20
	} = options

	const toast = useToast().toast

	// Reactive state
	const assets = ref<AssetsResponse | null>(null)
	const isLoading = ref(false)
	const error = ref<Error | null>(null)
	const typeFilter = ref<AssetType | 'all'>(initialType)
	const categoryFilter = ref<string[]>(initialCategories)
	const currentPage = ref(1)
	const pageSize = ref(initialPageSize)

	// Loading states for individual operations
	const isLoadingInfo = ref(false)
	const isLoadingFiles = ref(false)
	const isLoadingCategories = ref(false)

	/**
	 * Build query parameters for the assets endpoint
	 */
	const buildAssetsQuery = (): string => {
		const params = new URLSearchParams()

		if (typeFilter.value !== 'all') {
			params.append('type', typeFilter.value)
		}

		if (categoryFilter.value.length > 0) {
			params.append('categories', categoryFilter.value.join(','))
		}

		const query = params.toString()
		return query ? `?${query}` : ''
	}

	/**
	 * Fetch assets from the API
	 */
	const fetchAssets = async () => {
		isLoading.value = true
		error.value = null

		try {
			const query = buildAssetsQuery()
			const { data, error: fetchError } = await usePolyHavenFetch<AssetsResponse>(
				`/assets${query}`
			).json()

			if (fetchError.value) {
				throw new Error(fetchError.value)
			}

			if (data.value) {
				assets.value = data.value
				// Reset to first page when new data is loaded
				currentPage.value = 1
			}
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : 'Failed to fetch assets'
			error.value = new Error(errorMessage)
			toast.error('Failed to load assets', {
				title: 'API Error',
				message: errorMessage
			})
		} finally {
			isLoading.value = false
		}
	}

	/**
	 * Convert assets object to array with IDs
	 */
	const assetArray = computed<AssetWithId[]>(() => {
		if (!assets.value) return []
		return Object.entries(assets.value).map(([id, asset]) => ({
			...asset,
			id
		}))
	})

	/**
	 * Filter assets based on current filters
	 */
	const filteredAssets = computed<AssetWithId[]>(() => {
		let filtered = assetArray.value

		// Type filter
		if (typeFilter.value !== 'all') {
			const typeMap: Record<AssetType, 0 | 1 | 2> = {
				hdris: 0,
				textures: 1,
				models: 2
			}
			const targetType = typeMap[typeFilter.value]
			filtered = filtered.filter((asset) => asset.type === targetType)
		}

		// Category filter
		if (categoryFilter.value.length > 0) {
			filtered = filtered.filter((asset) =>
				categoryFilter.value.every((cat) => asset.categories.includes(cat))
			)
		}

		return filtered
	})

	/**
	 * Total number of pages
	 */
	const totalPages = computed(() => {
		return Math.ceil(filteredAssets.value.length / pageSize.value)
	})

	/**
	 * Get paginated assets for current page
	 */
	const paginatedAssets = computed<AssetWithId[]>(() => {
		const start = (currentPage.value - 1) * pageSize.value
		const end = start + pageSize.value
		return filteredAssets.value.slice(start, end)
	})

	/**
	 * Check if there's a next page
	 */
	const hasNextPage = computed(() => {
		return currentPage.value < totalPages.value
	})

	/**
	 * Check if there's a previous page
	 */
	const hasPrevPage = computed(() => {
		return currentPage.value > 1
	})

	/**
	 * Navigate to next page
	 */
	const nextPage = () => {
		if (hasNextPage.value) {
			currentPage.value++
		}
	}

	/**
	 * Navigate to previous page
	 */
	const prevPage = () => {
		if (hasPrevPage.value) {
			currentPage.value--
		}
	}

	/**
	 * Go to a specific page
	 */
	const goToPage = (page: number) => {
		if (page >= 1 && page <= totalPages.value) {
			currentPage.value = page
		}
	}

	/**
	 * Set type filter and refetch
	 */
	const setTypeFilter = (type: AssetType | 'all') => {
		typeFilter.value = type
		currentPage.value = 1
	}

	/**
	 * Set category filter and refetch
	 */
	const setCategoryFilter = (categories: string[]) => {
		categoryFilter.value = categories
		currentPage.value = 1
	}

	/**
	 * Clear all filters
	 */
	const clearFilters = () => {
		typeFilter.value = 'all'
		categoryFilter.value = []
		currentPage.value = 1
	}

	/**
	 * Refetch assets with current filters
	 */
	const refetch = async () => {
		await fetchAssets()
	}

	/**
	 * Fetch detailed information about a specific asset
	 */
	const fetchAssetInfo = async <T extends Asset = Asset>(id: string): Promise<T | null> => {
		isLoadingInfo.value = true

		try {
			const { data, error: fetchError } = await usePolyHavenFetch<T>(`/info/${id}`).json()

			if (fetchError.value) {
				throw new Error(fetchError.value)
			}

			return data.value
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : 'Failed to fetch asset info'
			toast.error('Failed to load asset details', {
				title: 'API Error',
				message: errorMessage
			})
			return null
		} finally {
			isLoadingInfo.value = false
		}
	}

	/**
	 * Fetch file URLs for a specific asset
	 */
	const fetchAssetFiles = async (id: string): Promise<AssetFiles | null> => {
		isLoadingFiles.value = true

		try {
			const { data, error: fetchError } = await usePolyHavenFetch<AssetFiles>(`/files/${id}`).json()

			if (fetchError.value) {
				throw new Error(fetchError.value)
			}

			return data.value
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : 'Failed to fetch asset files'
			toast.error('Failed to load asset files', {
				title: 'API Error',
				message: errorMessage
			})
			return null
		} finally {
			isLoadingFiles.value = false
		}
	}

	/**
	 * Fetch available categories for a specific asset type
	 */
	const fetchCategories = async (type: AssetType): Promise<CategoryResponse | null> => {
		isLoadingCategories.value = true

		try {
			const { data, error: fetchError } = await usePolyHavenFetch<CategoryResponse>(
				`/categories/${type}`
			).json()

			if (fetchError.value) {
				throw new Error(fetchError.value)
			}

			return data.value
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : 'Failed to fetch categories'
			toast.error('Failed to load categories', {
				title: 'API Error',
				message: errorMessage
			})
			return null
		} finally {
			isLoadingCategories.value = false
		}
	}

	/**
	 * Get asset type name from type number
	 */
	const getAssetTypeName = (typeNum: 0 | 1 | 2): AssetType => {
		const typeMap: Record<0 | 1 | 2, AssetType> = {
			0: 'hdris',
			1: 'textures',
			2: 'models'
		}
		return typeMap[typeNum]
	}

	/**
	 * Type guard for HDRI assets
	 */
	const isHDRI = (asset: Asset): asset is HDRIAsset => {
		return asset.type === 0
	}

	/**
	 * Type guard for Texture assets
	 */
	const isTexture = (asset: Asset): asset is TextureAsset => {
		return asset.type === 1
	}

	/**
	 * Type guard for Model assets
	 */
	const isModel = (asset: Asset): asset is ModelAsset => {
		return asset.type === 2
	}

	// Auto-fetch on initialization if enabled
	if (autoFetch) {
		fetchAssets()
	}

	// Watch for filter changes and refetch
	watch([typeFilter, categoryFilter], () => {
		if (assets.value) {
			// Only refetch if we need to (filters changed that require new API call)
			// For now, we do client-side filtering, so no need to refetch
			currentPage.value = 1
		}
	})

	/**
	 * Get the glTF model URL for a specific asset and resolution
	 * This returns the main glTF file URL that can be loaded directly
	 * The modelLoader will handle texture loading via the base path
	 */
	const getModelUrl = async (
		assetId: string,
		resolution: '1k' | '2k' | '4k' | '8k' = '1k',
		format: 'gltf' | 'blend' | 'fbx' | 'usd' = 'gltf'
	): Promise<string | null> => {
		try {
			const files = await fetchAssetFiles(assetId)
			if (!files) return null

			// Access the format files - use type assertion for dynamic access
			const formatFiles = files[format as keyof typeof files] as Record<
				string,
				Record<
					string,
					{ url: string; md5: string; size: number; include?: Record<string, unknown> }
				>
			>
			if (!formatFiles || typeof formatFiles !== 'object') return null

			// Access the resolution
			const resolutionFiles = formatFiles[resolution]
			if (!resolutionFiles || typeof resolutionFiles !== 'object') return null

			// Get the file info
			const fileInfo = resolutionFiles[format]
			if (!fileInfo || typeof fileInfo !== 'object') return null

			// Return the URL
			return fileInfo.url || null
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : 'Failed to get model URL'
			toast.error('Failed to get model URL', {
				title: 'API Error',
				message: errorMessage
			})
			return null
		}
	}

	/**
	 * Get model data with texture URL mapping for PolyHaven models
	 * This is necessary because PolyHaven glTF files reference textures with relative paths
	 * but the actual textures are at different URLs
	 */
	const getModelData = async (
		assetId: string,
		resolution: '1k' | '2k' | '4k' | '8k' = '1k',
		format: 'gltf' | 'blend' | 'fbx' | 'usd' = 'gltf'
	): Promise<{ url: string; textureUrlMap: Record<string, string> } | null> => {
		try {
			const files = await fetchAssetFiles(assetId)
			if (!files) return null

			// Access the format files
			const formatFiles = files[format as keyof typeof files] as Record<
				string,
				Record<
					string,
					{
						url: string
						md5: string
						size: number
						include?: Record<string, { url: string; md5: string; size: number }>
					}
				>
			>
			if (!formatFiles || typeof formatFiles !== 'object') return null

			// Access the resolution
			const resolutionFiles = formatFiles[resolution]
			if (!resolutionFiles || typeof resolutionFiles !== 'object') return null

			// Get the file info
			const fileInfo = resolutionFiles[format]
			if (!fileInfo || typeof fileInfo !== 'object') return null

			// Build texture URL map from the include property
			const textureUrlMap: Record<string, string> = {}
			if (fileInfo.include) {
				for (const [texturePath, textureInfo] of Object.entries(fileInfo.include)) {
					// Extract just the filename from the path (e.g., "textures/Camera_01_body_diff_1k.jpg" -> "Camera_01_body_diff_1k.jpg")
					const filename = texturePath.split('/').pop()
					if (filename && textureInfo.url) {
						textureUrlMap[filename] = textureInfo.url
						// Also map the full path
						textureUrlMap[texturePath] = textureInfo.url
					}
				}
			}

			return {
				url: fileInfo.url,
				textureUrlMap
			}
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : 'Failed to get model data'
			toast.error('Failed to get model data', {
				title: 'API Error',
				message: errorMessage
			})
			return null
		}
	}

	return {
		// Data
		assets,
		assetArray,
		filteredAssets,
		paginatedAssets,

		// Loading states
		isLoading,
		isLoadingInfo,
		isLoadingFiles,
		isLoadingCategories,

		// Error state
		error,

		// Pagination
		currentPage,
		pageSize,
		totalPages,
		hasNextPage,
		hasPrevPage,
		nextPage,
		prevPage,
		goToPage,

		// Filters
		typeFilter,
		categoryFilter,
		setTypeFilter,
		setCategoryFilter,
		clearFilters,

		// Actions
		fetchAssets,
		refetch,
		fetchAssetInfo,
		fetchAssetFiles,
		fetchCategories,
		getModelUrl,
		getModelData,

		// Utilities
		getAssetTypeName,
		isHDRI,
		isTexture,
		isModel
	}
}

/**
 * Type helper for extracting specific asset types
 */
export type UsePolyHavenReturn = ReturnType<typeof usePolyHaven>
