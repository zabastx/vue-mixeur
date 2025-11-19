<template>
	<MDialog
		v-model:open="isOpen"
		title="Models Library"
		class="max-w-7xl text-ui-text-text block-border bg-window-bg"
	>
		<h1 class="p-1 text-xl flex items-center gap-1 bg-header-background">
			<IconAssetBrowser /> Asset Browser
		</h1>
		<div class="flex h-[75dvh] gap-2 p-2">
			<div class="bg-header-background flex flex-col gap-2 basis-[20%] shrink-0">
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
				<PolyhavenLicense class="mt-auto" />
			</div>
			<div class="overflow-hidden bg-ui-box-inner rounded grow">
				<ScrollContainer>
					<div class="flex gap-1 flex-wrap p-1">
						<div
							v-for="item in filteredAssets"
							:key="'asset_' + item.id"
							class="w-32 rounded p-1 cursor-pointer hover:bg-gray-500"
							:class="{ 'bg-browser-selected': selectedAsset?.name === item.name }"
							@click="selectAsset(item, setFilesData)"
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

			<div v-if="selectedAsset" class="bg-header-background flex flex-col basis-[25%] shrink-0">
				<ScrollContainer>
					<div class="flex flex-col gap-1 p-2 text-sm">
						<LibraryAssetDescription :asset="selectedAsset" :authors="selectedAssetAuthors" />
						<InputField label="Resolution" class="z-10 mt-2">
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
import type { AssetFiles, ModelFiles } from '@/composables/types/polyhaven'
import { usePolyHaven } from '@/composables/usePolyHaven'
import { useThreeStore } from '@/store/three'
import { bytesToSize } from '@/utils/utils'
import { CheckboxGroupRoot } from 'reka-ui'
import { computed, ref, shallowRef, watch } from 'vue'

const isOpen = defineModel<boolean>({ default: false })

const {
	assets,
	search,
	categories,
	fetchAssets,
	fetchCategories,
	filteredAssets,
	categoriesFilter,
	getModelData,
	selectedAsset,
	selectedAssetAuthors,
	selectAsset
} = usePolyHaven()

watch(isOpen, (val) => {
	if (!val || assets.value.length > 0) return
	fetchCategories('models')
	fetchAssets('models')
})

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
