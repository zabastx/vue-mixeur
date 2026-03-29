import type { ModelAssets, ModelFormat } from './parse-scene'

export type FileListItem = ModelFileItem | AssetFileItem

interface CommonFile {
	file: File
	id: string
}

export interface ModelFileItem extends CommonFile {
	type: ModelFormat
	assets: ModelAssets['uris']
}

export interface AssetFileItem extends CommonFile {
	type: 'asset'
	isImage?: boolean
	assets: string[]
}
