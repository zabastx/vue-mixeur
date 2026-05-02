import THREE from '@/shared/three'
import type { InputFieldValueMap, ObjectProp } from './types'
import { MathUtils } from 'three'
import { shallowRef, triggerRef } from 'vue'

export function useInputFields<T>(object: T) {
	const objectRef = shallowRef<T>(object)

	function setProp<Prop extends ObjectProp<T>>(
		type: keyof InputFieldValueMap,
		prop: Prop,
		value: InputFieldValueMap[typeof type]
	) {
		switch (type) {
			case 'color':
				object[prop] = new THREE.Color((value as string) ?? '#000000') as T[Prop]
				break
			case 'angle':
				object[prop] = MathUtils.degToRad(value as number) as T[Prop]
				break
			default:
				object[prop] = value as unknown as T[Prop]
		}
		triggerRef(objectRef)
	}

	function getProp<Prop extends ObjectProp<T>>(type: keyof InputFieldValueMap, prop: Prop) {
		switch (type) {
			case 'color':
				return `#${(objectRef.value[prop] as THREE.Color).getHexString()}` as string
			case 'angle':
				return MathUtils.radToDeg(objectRef.value[prop] as number)
			default:
				return objectRef.value[prop]
		}
	}

	return { setProp, getProp }
}
