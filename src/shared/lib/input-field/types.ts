import type THREE from '@/shared/three'
import type { MxTooltipContent, NonMethodKeys } from '../types'

export type ObjectProp<T> = NonNullable<NonMethodKeys<T>>

export type InputFieldValueMap = {
	color: string
	number: number | undefined
	angle: number | undefined
	checkbox: boolean | 'indeterminate' | undefined
	select: string | number | null | undefined
	euler: THREE.Euler
	vector2: THREE.Vector2
	vector3: THREE.Vector3
	map: THREE.Texture | undefined | null
	envMap: THREE.Texture | undefined | null
	range: [number, number] | undefined | null
}

export type InputField<T> = {
	prop: ObjectProp<T>
	label: string
	showIf?: ObjectProp<T>
	formatOptions?: Intl.NumberFormatOptions
} & (GenericInput | NumberInput | SelectInput)

interface GenericInput {
	type: 'color' | 'checkbox' | 'euler' | 'checkbox' | 'map' | 'envMap'
}

interface NumberInput {
	type: 'number' | 'angle' | 'vector2' | 'range'
	min?: number
	max?: number
	step?: number
}

interface SelectInput {
	type: 'select'
	options: { label: string; value: string | number | null; tooltip?: MxTooltipContent }[]
}
