<template>
	<div v-if="material">
		<MxAccordionRoot collapsible type="multiple" :default-value="['surface']" class="space-y-0.5">
			<MxAccordionItem label="Surface" :item="{ value: 'surface' }">
				<MatPropSurface />
			</MxAccordionItem>
			<MxAccordionItem
				v-if="hasDisplacement"
				label="Displacement"
				:item="{ value: 'displacement' }"
			>
				<div class="pl-1 py-1 pr-3 flex flex-col items-end gap-1">
					<MatPropDisplacement />
				</div>
			</MxAccordionItem>
			<MxAccordionItem label="Settings" :item="{ value: 'settings' }">
				<div class="pl-1 py-1 pr-3 flex flex-col items-end gap-1">
					<MatPropSettings />
				</div>
			</MxAccordionItem>
		</MxAccordionRoot>
	</div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useMeshMaterial } from './material'

const { material } = useMeshMaterial()

const hasDisplacement = computed(() => material.value && 'displacementMap' in material.value)
</script>
