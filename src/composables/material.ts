import { useShadingStore } from '@/store/shading'
import { useThreeStore } from '@/store/three'
import THREE from '@/three'
import { computed, ref } from 'vue'

export function useMeshMaterial<T extends THREE.Material>() {
	const threeStore = useThreeStore()
	const shadingStore = useShadingStore()
	const manualTrigger = ref(0)

	const selectedObject = computed(() => {
		if (threeStore.selectedObject instanceof THREE.Mesh) {
			return threeStore.selectedObject
		}
		return null
	})

	const material = computed<T | null>(() => {
		if (selectedObject.value) {
			const mat = shadingStore.getMaterial(selectedObject.value)?.original
			if (mat instanceof THREE.Material) return mat as T
		}
		return null
	})

	function updateMaterialProp(data: Parameters<typeof shadingStore.updateMaterial>[1]) {
		const obj = selectedObject.value
		if (!obj) return
		shadingStore.updateMaterial(obj, data)
		manualTrigger.value++
	}

	function getMaterialProp<P = unknown>(prop: keyof T) {
		if (!material.value) return
		// oxlint-disable-next-line no-unused-expressions
		// eslint-disable-next-line @typescript-eslint/no-unused-expressions
		manualTrigger.value
		return material.value[prop] as P
	}

	function changeMaterial(newMaterial: THREE.Material) {
		const obj = selectedObject.value
		if (!obj) return
		shadingStore.changeMaterial(obj, newMaterial)
	}

	return {
		material,
		getMaterialProp,
		updateMaterialProp,
		manualTrigger,
		changeMaterial,
		selectedObject
	}
}
