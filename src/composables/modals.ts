import { ref, shallowRef } from 'vue'
import type { FileInfo } from './types/polyhaven'

export const modelLibraryModalOpen = ref(false)

export const textureLibraryModalOpen = ref(false)
export const textureLibraryCallback = shallowRef<(texture: FileInfo) => Promise<unknown>>()

export const aboutModalOpen = ref(false)
