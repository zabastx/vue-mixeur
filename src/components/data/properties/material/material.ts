import { useShadingStore } from '@/store/shading'
import { useThreeStore } from '@/store/three'
import THREE from '@/three'
import { computed, ref } from 'vue'
import type { FieldValueMap, MaterialProp } from './utils/types'

export function useMeshMaterial<T extends THREE.Material>() {
	const threeStore = useThreeStore()
	const shadingStore = useShadingStore()
	const manualTrigger = ref(0)

	const mesh = computed(() => {
		if (threeStore.selectedObject instanceof THREE.Mesh) {
			return threeStore.selectedObject
		}
		return null
	})

	const material = computed<T | null>(() => {
		// oxlint-disable-next-line no-unused-expressions
		// eslint-disable-next-line @typescript-eslint/no-unused-expressions
		manualTrigger.value

		if (mesh.value) {
			const mat = shadingStore.getMaterialCache(mesh.value)?.original
			if (mat instanceof THREE.Material) return mat as T
		}
		return null
	})

	function updateMaterialProp(data: { prop: MaterialProp<T>; value: T[MaterialProp<T>] }) {
		if (!mesh.value) return
		shadingStore.updateMaterial<T>(mesh.value, data)
		manualTrigger.value++
	}

	function getMaterialProp<PropVal>(prop: MaterialProp<T>) {
		if (!material.value) return
		// oxlint-disable-next-line no-unused-expressions
		// eslint-disable-next-line @typescript-eslint/no-unused-expressions
		manualTrigger.value
		return material.value[prop] as PropVal
	}

	function changeMaterial(newMaterial: THREE.Material) {
		if (!mesh.value) return
		shadingStore.changeMaterial(mesh.value, newMaterial)
		manualTrigger.value++
	}

	function getPropValue<TType extends keyof FieldValueMap>(
		type: TType,
		prop: MaterialProp<T>
	): FieldValueMap[TType] {
		// oxlint-disable-next-line no-unused-expressions
		// eslint-disable-next-line @typescript-eslint/no-unused-expressions
		manualTrigger.value
		switch (type) {
			case 'color':
				return `#${getMaterialProp<THREE.Color>(prop)?.getHexString() ?? '000000'}` as FieldValueMap[TType]
			case 'map':
				return getMaterialProp<THREE.Texture>(prop) as FieldValueMap[TType]
			case 'envMap':
				return getMaterialProp<THREE.Texture>(prop) as FieldValueMap[TType]
			case 'number':
				return getMaterialProp<number>(prop) as FieldValueMap[TType]
			case 'angle':
				return THREE.MathUtils.radToDeg(getMaterialProp<number>(prop) || 0) as FieldValueMap[TType]
			case 'checkbox':
				return getMaterialProp<boolean>(prop) as FieldValueMap[TType]
			case 'select':
				return getMaterialProp<FieldValueMap[TType]>(prop) as FieldValueMap[TType]
			case 'range': {
				const value = getMaterialProp<THREE.Vector2>(prop)
				return (value instanceof THREE.Vector2 ? value.toArray() : value) as FieldValueMap[TType]
			}
		}
	}

	function setPropValue<TType extends keyof FieldValueMap>(
		type: TType,
		prop: MaterialProp<T>,
		value: FieldValueMap[TType]
	) {
		switch (type) {
			case 'color':
				updateMaterialProp({ prop, value: new THREE.Color(value as string) as T[MaterialProp<T>] })
				break
			case 'angle':
				updateMaterialProp({
					prop,
					value: THREE.MathUtils.degToRad((value as number) ?? 0) as T[MaterialProp<T>]
				})
				break
			case 'range':
				updateMaterialProp({
					prop,
					value: new THREE.Vector2().fromArray(value as number[]) as T[MaterialProp<T>]
				})
				break
			case 'map': {
				if (prop === 'gradientMap' && value instanceof THREE.Texture) {
					value.magFilter = THREE.NearestFilter
					value.minFilter = THREE.NearestFilter
				}
				updateMaterialProp({ prop, value: value as unknown as T[MaterialProp<T>] })
				break
			}
			default:
				updateMaterialProp({ prop, value: value as unknown as T[MaterialProp<T>] })
				break
		}
	}

	return {
		mesh,
		material,
		changeMaterial,
		getPropValue,
		setPropValue,
		getMaterialProp
	}
}
