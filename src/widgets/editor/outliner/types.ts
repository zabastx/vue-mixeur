import type { MxObjectUserData } from '@/shared/three/three'

export interface OutlinerItem {
	uuid: string
	type: string
	name: string
	userData: MxObjectUserData
	isCamera: boolean
	children?: OutlinerItem[]
}
