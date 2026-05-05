<template>
	<TreeVirtualizer
		v-slot="{ item, virtualizer, virtualItem }"
		:text-content="getTextContent"
		:estimate-size="estimateSize"
		:overscan="overscan"
	>
		<slot :item="toOutlinerItem(item)" :virtualizer="virtualizer" :virtual-item="virtualItem" />
	</TreeVirtualizer>
</template>

<script lang="ts" setup>
import type { FlattenedItem, TreeVirtualizerProps } from 'reka-ui'
import type { OutlinerItem } from './types'

const props = defineProps<{
	textContent?: (item: OutlinerItem) => string
	estimateSize?: TreeVirtualizerProps['estimateSize']
	overscan?: TreeVirtualizerProps['overscan']
}>()

defineSlots<{
	default(props: {
		item: FlattenedItem<OutlinerItem>
		virtualizer: unknown
		virtualItem: unknown
	}): unknown
}>()

function toOutlinerItem(item: FlattenedItem<Record<string, unknown>>) {
	return item as unknown as FlattenedItem<OutlinerItem>
}

function getTextContent(item: Record<string, unknown>) {
	const outlinerItem = item as unknown as OutlinerItem
	return props.textContent?.(outlinerItem) ?? outlinerItem.name
}
</script>
