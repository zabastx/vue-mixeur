<template>
	<MDialog
		v-model:open="isOpen"
		title="Models Library"
		class="max-w-7xl text-ui-text-text block-border bg-window-bg"
	>
		<h1 class="p-1 text-xl flex items-center gap-1 bg-header-background">
			<IconAssetBrowser /> Asset Browser
		</h1>
		<div class="grid grid-cols-[20%_1fr_30%] h-[75dvh] gap-2 p-2">
			<div class="bg-header-background flex flex-col gap-2">
				<div
					class="h-[300px] bg-ui-box-inner border border-ui-box-outline rounded-ui-box p-2 pr-0
						text-sm flex flex-col gap-1"
				>
					<h2>Categories</h2>
					<ScrollContainer>
						<CheckboxGroupRoot v-model="categoriesFilter">
							<div
								v-for="item in categories"
								:key="'category_' + item.title"
								class="flex flex-col gap-1"
							>
								<InputField :label="item.title" reverse class="items-center">
									<InputCheckbox :value="item.title" />
								</InputField>
							</div>
						</CheckboxGroupRoot>
					</ScrollContainer>
				</div>
				<input v-model="search" type="text" class="input" placeholder="Search models" />
				<div class="mt-auto rounded text-xs">
					<div class="font-semibold mb-1">License Information</div>
					<div class="mb-2">
						All assets from Poly Haven are licensed under
						<a
							href="https://creativecommons.org/publicdomain/zero/1.0/"
							rel="external license"
							target="_blank"
							class="hover:underline text-blue-500 font-semibold"
						>
							CC0 (Public Domain)
						</a>
					</div>
					<div class="text-gray-400 mb-1">
						This means you can use them for any purpose, including commercial projects, without
						attribution.
					</div>
					<a
						href="https://polyhaven.com/license"
						rel="external license"
						target="_blank"
						class="hover:underline text-blue-500"
					>
						Learn more about Poly Haven's license
					</a>
				</div>
			</div>
			<div class="overflow-hidden bg-ui-box-inner rounded">
				<ScrollContainer>
					<div class="flex gap-1 flex-wrap p-1">
						<div
							v-for="item in filteredAssets"
							:key="'asset_' + item.id"
							class="w-32 rounded p-1 cursor-pointer hover:bg-gray-500"
							:class="{ 'bg-browser-selected': selectedAsset?.name === item.name }"
							@click="selectAsset(item)"
						>
							<div class="w-full h-28 p-1">
								<img
									:src="item.thumbnail_url"
									:alt="item.name"
									class="object-contain object-center size-full"
									loading="lazy"
								/>
							</div>
							<div
								class="text-xs text-center h-10 flex items-center justify-center overflow-hidden
									text-ellipsis"
							>
								{{ item.name }}
							</div>
						</div>
					</div>
				</ScrollContainer>
			</div>

			<div v-if="selectedAsset" class="bg-header-background flex flex-col">
				<ScrollContainer>
					<div class="flex flex-col gap-1 p-2 text-sm">
						<img
							:src="selectedAsset.thumbnail_url"
							:alt="selectedAsset.name"
							class="block mx-2 h-40 object-contain"
						/>
						<div>{{ selectedAsset.name }}</div>
						<div v-if="selectedAssetAuthor">
							<b>Author: </b>
							<a
								v-if="selectedAssetAuthor.link"
								:href="selectedAssetAuthor.link"
								class="hover:underline text-blue-500"
								target="_blank"
								rel="author external"
							>
								{{ selectedAssetAuthor.name }}
							</a>
							<template v-else>{{ selectedAssetAuthor.name }}</template>
						</div>
						<div v-if="selectedAsset.description">
							<b>Description:</b> {{ selectedAsset.description }}
						</div>
						<div><b>Categories:</b> {{ selectedAsset.categories.join(', ') }}</div>
						<div><b>Tags:</b> {{ selectedAsset.tags.join(', ') }}</div>
						<InputField label="Resolution" class="z-10">
							<InputSelect v-model="selectedResOption" class="z-10" :items="fileResOptions" />
						</InputField>
						<div><b>Size: </b>{{ selectedOptionData?.size }}</div>
					</div>
				</ScrollContainer>
				<button type="button" class="btn mt-auto" @click="importModel">Import model</button>
			</div>
		</div>
	</MDialog>
</template>

<script lang="ts" setup>
import type {
	AssetAuthorInfo,
	AssetFiles,
	AssetWithId,
	ModelAsset,
	ModelFiles
} from '@/composables/types/polyhaven'
import { usePolyHaven } from '@/composables/usePolyHaven'
import { useThreeStore } from '@/store/three'
import { CheckboxGroupRoot } from 'reka-ui'
import { computed, ref, shallowRef } from 'vue'

const isOpen = defineModel<boolean>({ default: false })

const {
	search,
	categories,
	fetchAssets,
	fetchCategories,
	filteredAssets,
	categoriesFilter,
	fetchAssetInfo,
	fetchAssetAuthor,
	fetchAssetFiles,
	getModelData
} = usePolyHaven()

fetchCategories('models')
fetchAssets('models')

const selectedAsset = shallowRef<AssetWithId>()
const selectedAssetAuthor = shallowRef<AssetAuthorInfo>()

function selectAsset(asset: AssetWithId) {
	const authorId = Object.keys(asset.authors)[0]

	if (authorId) {
		fetchAssetAuthor(authorId)
			.then((author) => {
				if (!author) return
				selectedAssetAuthor.value = author
			})
			.catch(() => {})
	}

	fetchAssetInfo<ModelAsset>(asset.id)
		.then((item) => {
			if (!item) return
			selectedAsset.value = { ...item, id: asset.id }
		})
		.catch(() => {})

	fetchAssetFiles(asset.id)
		.then((item) => {
			if (!item) return
			setFilesData(item)
		})
		.catch(() => {})
}

const modelFilesData = ref<ModelFiles['gltf']>()
const fileResOptions = shallowRef<{ value: string; label: string }[]>([])
const selectedResOption = ref<{ value: string; label: string }>()

const selectedOptionData = computed(() => {
	if (!selectedResOption.value || !modelFilesData.value) return null
	const data = modelFilesData.value[selectedResOption.value.value]?.['gltf']
	if (!data) return null
	const includedFiles = data.include ? Object.values(data.include) : []
	const sizeInBytes = data.size + includedFiles.reduce((prev, cur) => cur.size + prev, 0)
	return {
		size: bytesToSize(sizeInBytes)
	}
})

function setFilesData(files: AssetFiles) {
	if ('gltf' in files) {
		const gtlfData = files['gltf']
		if (!gtlfData) return
		modelFilesData.value = gtlfData
		fileResOptions.value = Object.keys(gtlfData).map((value) => ({ value, label: value }))
		selectedResOption.value = fileResOptions.value[0]
	}
}

function bytesToSize(bytes: number) {
	const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
	if (bytes === 0) return 'n/a'
	const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)).toString(), 10)
	if (i === 0) return `${bytes} ${sizes[i]})`
	return `${(bytes / 1024 ** i).toFixed(1)} ${sizes[i]}`
}

const threeStore = useThreeStore()

function importModel() {
	if (!selectedResOption.value || !selectedAsset.value || !modelFilesData.value) return
	const data = getModelData({
		format: 'gltf',
		resolution: selectedResOption.value.value,
		files: modelFilesData.value
	})
	if (data) {
		threeStore.importModel({ ...data, format: 'gltf', filename: selectedAsset.value.name })
	}
	isOpen.value = false
}
</script>
