import type { MxTooltipContent } from '@/utils/types'
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
	euler: THREE.Euler
	vector2: THREE.Vector2
}

interface MaterialInput<T extends THREE.Material> {
	label: string
	prop: MaterialProp<T>
	showIf?: MaterialProp<T>
}

interface MaterialGenericInput<T extends THREE.Material> extends MaterialInput<T> {
	type: 'color' | 'map' | 'envMap' | 'checkbox' | 'euler' | 'checkbox'
}

interface MaterialNumberInput<T extends THREE.Material> extends MaterialInput<T> {
	type: 'number' | 'angle' | 'vector2'
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
	| MaterialGenericInput<T>
	| MaterialNumberInput<T>
	| MaterialSelectInput<T>
	| MaterialRangeInput<T>

export type MeshMaterials =
	| THREE.MeshPhysicalMaterial
	| THREE.MeshToonMaterial
	| THREE.MeshStandardMaterial
	| THREE.MeshPhongMaterial
	| THREE.MeshNormalMaterial
	| THREE.MeshDepthMaterial
	| THREE.MeshLambertMaterial
	| THREE.MeshMatcapMaterial
