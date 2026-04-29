<template>
	<div class="grid grid-rows-[auto_1fr] h-full gap-2">
		<div class="flex">
			<MxButton icon="ui/loop-back" class="ml-auto" @click="reset">Reset</MxButton>
		</div>
		<div>
			<MxAccordionRoot type="multiple" collapsible>
				<MxAccordionItem :item="{ value: 'ui' }" label="User Interface" icon="ui/workspace">
					<MxAccordionItem label="Button" :item="{ value: 'button' }" nested>
						<ThemeInputs :fields="ThemeFieldsButton" />
					</MxAccordionItem>
					<MxAccordionItem label="Number Field" :item="{ value: 'number-field' }" nested>
						<ThemeInputs :fields="ThemeFieldsNumberField" />
					</MxAccordionItem>
					<MxAccordionItem label="Select" :item="{ value: 'select' }" nested>
						<ThemeInputs :fields="ThemeFieldsSelect" />
					</MxAccordionItem>
				</MxAccordionItem>
			</MxAccordionRoot>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { usePreferencesStore } from '@/app/model/preferences'
import { ThemeFieldsButton } from './themes/blocks/button'
import { ThemeFieldsNumberField } from './themes/blocks/number-field'
import { ThemeFieldsSelect } from './themes/blocks/select'

const { reset } = usePreferencesStore()
</script>
