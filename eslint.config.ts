import { globalIgnores } from 'eslint/config'
import {
	defineConfigWithVueTs,
	vueTsConfigs,
} from '@vue/eslint-config-typescript'
import pluginVue from 'eslint-plugin-vue'
import pluginVitest from '@vitest/eslint-plugin'
import pluginPlaywright from 'eslint-plugin-playwright'
import { configureVueProject } from '@vue/eslint-config-typescript'
import stylistic from '@stylistic/eslint-plugin'

configureVueProject({ scriptLangs: ['ts', 'tsx'] })

export default defineConfigWithVueTs(
	globalIgnores(['**/dist/**', '**/dist-ssr/**', '**/coverage/**']),

	pluginVue.configs['flat/essential'],
	vueTsConfigs.recommended,
	stylistic.configs.recommended,

	{
		...pluginVitest.configs.recommended,
		files: ['src/**/__tests__/*'],
	},

	{
		...pluginPlaywright.configs['flat/recommended'],
		files: ['e2e/**/*.{test,spec}.{js,ts,jsx,tsx}'],
	},

	{
		name: 'app/files-to-lint',
		files: ['**/*.{ts,mts,tsx,vue}'],
		plugins: {
			'@stylistic': stylistic,
		},
		rules: {
			'indent': ['error', 'tab'],
			'@stylistic/comma-dangle': 'off',
			'@stylistic/indent': ['error', 'tab'],
			'@stylistic/indent-binary-ops': ['error', 'tab'],
			'@stylistic/no-tabs': ['off']
		},
	},
)
