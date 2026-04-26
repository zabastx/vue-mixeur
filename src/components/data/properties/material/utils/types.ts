import type { MxTooltipContent } from '@/components/base/ui/MxTooltip.vue'
import type THREE from '@/three'

type NonMethodKeys<T> = {
	[K in keyof T & string]: T[K] extends (...args: never[]) => unknown ? never : K
}[keyof T & string]

export type MaterialProp<T extends THREE.Material> = NonNullable<NonMethodKeys<T>>

export type FieldValueMap = {
	color: string
	map: THREE.Texture | undefined | null
	envMap: THREE.Texture | undefined | null
	number: number | undefined
	angle: number | undefined
	checkbox: boolean | 'indeterminate' | undefined
	select: string | number | null | undefined
	range: number[]
}

interface MaterialInput<T extends THREE.Material> {
	label: string
	prop: MaterialProp<T>
	showIf?: MaterialProp<T>
}

interface MaterialColorInput<T extends THREE.Material> extends MaterialInput<T> {
	type: 'color'
}

interface MaterialMapInput<T extends THREE.Material> extends MaterialInput<T> {
	type: 'map'
}
interface MaterialEnvMapInput<T extends THREE.Material> extends MaterialInput<T> {
	type: 'envMap'
}

interface MaterialCheckInput<T extends THREE.Material> extends MaterialInput<T> {
	type: 'checkbox'
}

interface MaterialNumberInput<T extends THREE.Material> extends MaterialInput<T> {
	type: 'number' | 'angle'
	min?: number
	max?: number
	step?: number
}

interface MaterialSelectInput<T extends THREE.Material> extends MaterialInput<T> {
	type: 'select'
	options: { label: string; value: string | number | null; tooltip?: MxTooltipContent }[]
}

interface MaterialRangeInput<T extends THREE.Material> extends MaterialInput<T> {
	type: 'range'
	min?: number
	max?: number
	step?: number
}

export type MaterialInputField<T extends THREE.Material = THREE.Material> =
	| MaterialColorInput<T>
	| MaterialMapInput<T>
	| MaterialNumberInput<T>
	| MaterialCheckInput<T>
	| MaterialSelectInput<T>
	| MaterialRangeInput<T>
	| MaterialEnvMapInput<T>

export type MeshMaterials =
	| THREE.MeshPhysicalMaterial
	| THREE.MeshToonMaterial
	| THREE.MeshStandardMaterial
	| THREE.MeshPhongMaterial
	| THREE.MeshNormalMaterial
	| THREE.MeshDepthMaterial
	| THREE.MeshLambertMaterial
	| THREE.MeshMatcapMaterial
