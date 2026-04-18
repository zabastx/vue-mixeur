<template>
	<MxDialog
		v-model="isOpen"
		title="File Browser"
		class="max-w-6xl w-full h-2/3 text-ui-text-text block-border bg-window-bg flex flex-col"
		resize
		:root="{
			modal: false
		}"
		outside-interaction
		icon="file/bin"
	>
		<div class="h-full p-2 grid grid-rows-[1fr_min-content] gap-1" data-testid="import-scene">
			<div class="grid grid-cols-[300px_1fr_250px] gap-2 overflow-hidden">
				<ScrollContainer>
					<ImportSceneFiles
						ref="sceneFilesRef"
						:selected-file="selectedFile"
						@file-select="onFileSelect"
					/>
				</ScrollContainer>
				<div class="flex flex-col gap-2 overflow-hidden">
					<div
						class="text-sm text-ui-text-disabled space-y-1 rounded border border-ui-box-outline px-2
							py-1 bg-ui-box-inner"
					>
						<p class="font-medium text-ui-text-text">How to import models:</p>
						<ol class="list-decimal list-inside">
							<li>Upload model file (.obj, .gltf, .glb, .fbx)</li>
							<li>Upload assets (.mtl, textures, .bin)</li>
							<li>Select model in left panel</li>
							<li>Map required assets below</li>
							<li>Click Import</li>
						</ol>
					</div>
					<template v-if="selectedFile">
						<p>{{ selectedFile.file.name }}</p>
						<template v-if="requiredAssets.length > 0">
							<h2 class="flex justify-between text-sm">
								Required Assets:
								<button type="button" class="btn px-2 text-sm" @click="autoFillAssets">
									Auto Fill
								</button>
							</h2>
							<div class="space-y-0.5 overflow-hidden">
								<ScrollContainer class="text-xs rounded grow h-full max-h-full pr-3">
									<div
										v-for="item in requiredAssets"
										:key="item"
										class="border-b border-ui-text-outline pb-0.5 last:border-b-0 grid
											grid-cols-[1fr_200px]"
									>
										<span class="truncate">{{ item }}</span>
										<InputSelect
											:items="assetOptions"
											:model-value="assetsMap[selectedFile.id].get(item)"
											@update:model-value="onAssetSelect(selectedFile.id, item, $event)"
										/>
									</div>
								</ScrollContainer>
							</div>
						</template>
						<p v-else>No additional assets required</p>
					</template>
				</div>
				<ImportSceneSettings ref="settingsRef" :selected-file="selectedFile" />
			</div>

			<div class="text-sm flex gap-1 justify-end">
				<button type="button" class="btn btn--highlight px-2" @click="importScene">Import</button>
				<button type="button" class="btn px-2" @click="isOpen = false">Cancel</button>
			</div>
		</div>
	</MxDialog>
</template>

<script lang="ts" setup>
import { computed, reactive, shallowRef, useTemplateRef, watch } from 'vue'
import ImportSceneFiles from './ImportSceneFiles.vue'
import { useThreeStore } from '@/store/three'
import type { ModelFileItem } from './types'
import type ImportSceneSettings from './ImportSceneSettings.vue'
import { detectMTL } from './parse-scene'
import { useToast } from '@/composables/toast'

const isOpen = defineModel<boolean>()
const toast = useToast()

const sceneFilesRef = useTemplateRef<InstanceType<typeof ImportSceneFiles> | null>('sceneFilesRef')

const selectedFile = shallowRef<ModelFileItem | null>(null)

watch(isOpen, (val) => {
	if (!val) selectedFile.value = null
})

function onFileSelect(file: ModelFileItem) {
	selectedFile.value = file

	if (!assetsMap[file.id]) {
		assetsMap[file.id] = new Map()
		autoFillAssets()
	}
}

function autoFillAssets() {
	if (!selectedFile.value) return

	const getFilename = (str: string) => str.split('/').pop()

	requiredAssets.value.forEach((asset) => {
		const filename = getFilename(asset)
		const assetFile = sceneFilesRef.value?.assetFiles.find(
			(item) => getFilename(item.file.name) === filename
		)
		if (!filename || !assetFile || !selectedFile.value) return

		assetsMap[selectedFile.value.id].set(asset, assetFile.id)
	})
}

const requiredAssets = computed(() => {
	if (!selectedFile.value) return []
	const pickedAssetsIDs = Array.from(assetsMap[selectedFile.value.id].values())
	const additionalAssets = pickedAssetsIDs.flatMap(
		(id) => sceneFilesRef.value?.assetFiles.find((item) => item.id === id)?.assets || []
	)
	return selectedFile.value.assets.concat(additionalAssets)
})

const assetOptions = computed(() => {
	if (!sceneFilesRef.value) return []
	return sceneFilesRef.value.assetFiles.map(({ id, file }) => ({
		value: id,
		label: file.name
	}))
})

const assetsMap = reactive<Record<string, Map<string, string>>>({})

function onAssetSelect(sceneFileId: string, key: string, val?: string) {
	if (val) {
		assetsMap[sceneFileId].set(key, val)
	}
}

const settingsRef = useTemplateRef<InstanceType<typeof ImportSceneSettings> | null>('settingsRef')
const store = useThreeStore()

// ── Shared urlModifier factory to avoid duplication and ensure blob cleanup ────

function createUrlModifier(sceneFileId: string, primaryUrl: string, blobUrls: string[]) {
	const map = assetsMap[sceneFileId]
	return (url: string) => {
		if (url === primaryUrl) return url
		const blobBase = primaryUrl.substring(0, primaryUrl.lastIndexOf('/') + 1)
		const relativeUri = decodeURIComponent(url.replace(blobBase, ''))
		let assetId = map.get(relativeUri)

		if (!assetId) {
			const filename = relativeUri.split('/').pop() ?? ''
			for (const [uri, id] of map) {
				if (uri.split('/').pop() === filename) {
					assetId = id
					break
				}
			}
		}

		if (!assetId) return url
		const asset = sceneFilesRef.value?.assetFiles.find((f) => f.id === assetId)
		if (!asset) return url
		const newUrl = URL.createObjectURL(asset.file)
		blobUrls.push(newUrl)
		return newUrl
	}
}

async function importScene() {
	if (!selectedFile.value) return

	try {
		switch (selectedFile.value.type) {
			case 'gltf':
				await importGLTF(selectedFile.value)
				break
			case 'glb':
				await importGLTF(selectedFile.value)
				break
			case 'obj':
				await importOBJScene(selectedFile.value)
				break
			case 'fbx':
				await importFBX(selectedFile.value)
				break
		}
	} catch (e) {
		console.error('Failed to import scene:', e)
		toast.add({ type: 'error', message: `Failed to import ${selectedFile.value.file.name}` })
	}
}

async function importGLTF(sceneFile: ModelFileItem) {
	const gltfUrl = URL.createObjectURL(sceneFile.file)
	const blobUrls: string[] = [gltfUrl]

	try {
		const { loadGTLF } = await import('@/three/modules/loaders/gltf')
		const gltf = await loadGTLF({
			url: gltfUrl,
			filename: sceneFile.file.name,
			isBinary: sceneFile.type === 'glb',
			urlModifier: createUrlModifier(sceneFile.id, gltfUrl, blobUrls)
		})
		isOpen.value = false

		if (gltf) {
			gltf.scene.name = sceneFile.file.name
			store.addObjectToScene(gltf.scene)
		}
	} finally {
		blobUrls.forEach((url) => URL.revokeObjectURL(url))
	}
}

async function importFBX(sceneFile: ModelFileItem) {
	const fbxUrl = URL.createObjectURL(sceneFile.file)
	const blobUrls: string[] = [fbxUrl]

	try {
		const { loadFBX } = await import('@/three/modules/loaders/fbx')
		const fbx = await loadFBX({
			url: fbxUrl,
			filename: sceneFile.file.name,
			urlModifier: createUrlModifier(sceneFile.id, fbxUrl, blobUrls)
		})
		isOpen.value = false

		if (fbx) {
			fbx.name = sceneFile.file.name
			store.addObjectToScene(fbx)
		}
	} finally {
		blobUrls.forEach((url) => URL.revokeObjectURL(url))
	}
}

async function importOBJScene(sceneFile: ModelFileItem) {
	const objUrl = URL.createObjectURL(sceneFile.file)
	const blobUrls: string[] = [objUrl]

	try {
		const { loadOBJ } = await import('@/three/modules/loaders/obj')
		const map = assetsMap[sceneFile.id]
		const mtlId = map.get(sceneFile.assets[0])
		let mtlFile = sceneFilesRef.value?.assetFiles.find((f) => f.id === mtlId)

		if (mtlFile) {
			const buffer = await mtlFile.file.arrayBuffer()
			const text = new TextDecoder().decode(buffer)
			if (!detectMTL({ text })) mtlFile = undefined
		}

		let obj: Awaited<ReturnType<typeof loadOBJ>>

		if (mtlFile) {
			const { loadMTL } = await import('@/three/modules/loaders/mtl')
			const mtlUrl = URL.createObjectURL(mtlFile.file)
			blobUrls.push(mtlUrl)
			const materials = await loadMTL({
				url: mtlUrl,
				filename: mtlFile.file.name,
				materialOptions: settingsRef.value?.settings.mtl,
				urlModifier: createUrlModifier(sceneFile.id, mtlUrl, blobUrls)
			})

			obj = await loadOBJ({
				url: objUrl,
				filename: sceneFile.file.name,
				materials
			})
		} else {
			obj = await loadOBJ({
				url: objUrl,
				filename: sceneFile.file.name
			})
		}

		isOpen.value = false

		if (obj) {
			obj.name = sceneFile.file.name
			store.addObjectToScene(obj)
		}
	} finally {
		blobUrls.forEach((url) => URL.revokeObjectURL(url))
	}
}
</script>
