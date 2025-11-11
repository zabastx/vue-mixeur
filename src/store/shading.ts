import THREE from '@/three'
import type { LightHelper } from '@/three/modules/light'
import { loadWorldTexture } from '@/three/modules/loaders/environment'
import { acceptHMRUpdate, defineStore } from 'pinia'
import { computed, ref, shallowRef } from 'vue'

export const useShadingStore = defineStore('shading', () => {
	let scene: THREE.Scene | null = null
	const solidModeLights = getSolidShadingLights()
	const currentMode = ref<ShadingMode>('solid')
	const environmentMap = shallowRef<THREE.Texture | null>(null)
	const materialCache = new Map<string, MaterialCache>()
	const shadingMode = computed(() => currentMode.value)

	/**
	 * Determines if an object should be affected by shading modes.
	 * Only objects explicitly marked as shadable will be affected by shading changes.
	 * Uses userData.isShadable to identify objects that should respond to shading modes.
	 *
	 * @param object - The object to check
	 * @returns True if the object should be shaded, false otherwise
	 */
	function shouldShadeObject(object: THREE.Object3D): boolean {
		// Only objects explicitly marked as shadable will be affected
		return !!object.userData.isShadable
	}

	/**
	 * Caches the original materials of all meshes in the scene.
	 * This allows restoring the original materials when switching back to 'rendered' mode.
	 * Only caches materials for objects marked as shadable.
	 */
	function cacheOriginalMaterials() {
		if (!scene) return
		scene.traverse((object) => {
			if (object instanceof THREE.Mesh && object.material && shouldShadeObject(object)) {
				cacheMeshMaterials(object)
			}
		})
	}

	/**
	 * Caches materials for a newly added mesh object.
	 * This should be called whenever new meshes are added to the scene after initialization.
	 * Only caches materials for objects marked as shadable.
	 *
	 * @param object - The mesh object to cache materials for
	 */
	function cacheNewObjectMaterials(object: THREE.Object3D) {
		object.traverse((child) => {
			if (
				child instanceof THREE.Mesh &&
				child.material &&
				!materialCache.has(child.uuid) &&
				shouldShadeObject(child)
			) {
				cacheMeshMaterials(child)
				// Apply current shading mode to the new mesh
				applyModeToMesh(child, currentMode.value)
			}
		})
	}

	/**
	 * Caches materials for a single mesh.
	 *
	 * @param mesh - The mesh to cache materials for
	 */
	function cacheMeshMaterials(mesh: THREE.Mesh) {
		if (!mesh.material) return

		const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material]
		const originalMaterials = materials.map((mat) => mat.clone())
		materialCache.set(mesh.uuid, {
			original: Array.isArray(mesh.material) ? originalMaterials : originalMaterials[0]!,
			current: mesh.material
		})
	}

	/**
	 * Sets the shading mode for all meshes in the scene.
	 *
	 * @param mode - The shading mode to apply ('wireframe', 'solid', 'materialPreview', or 'rendered')
	 */
	function setMode(mode: ShadingMode) {
		if (!scene || mode === shadingMode.value) return
		currentMode.value = mode

		if (mode === 'solid') {
			solidModeLights.forEach((item) => scene?.add(item))
		} else {
			solidModeLights.forEach((item) => scene?.remove(item))
		}

		if (mode === 'materialPreview') {
			scene.environment = environmentMap.value
		} else {
			scene.environment = null
		}

		if (mode === 'rendered') {
			setSceneLightsVisibility(true)
		} else {
			setSceneLightsVisibility(false)
		}

		scene.traverse((object) => {
			if (object instanceof THREE.Mesh) {
				applyModeToMesh(object, mode)
			}
		})
	}

	function setEnvironmentMap(map: THREE.Texture) {
		environmentMap.value = map
	}

	/**
	 * Applies the specified shading mode to a single mesh.
	 *
	 * @param mesh - The mesh to apply the shading mode to
	 * @param mode - The shading mode to apply
	 */
	function applyModeToMesh(mesh: THREE.Mesh, mode: ShadingMode) {
		const cache = materialCache.get(mesh.uuid)
		if (!cache) return

		let newMaterial: THREE.Material | THREE.Material[]

		switch (mode) {
			case 'wireframe':
				newMaterial = createWireframeMaterial(cache.original)
				break
			case 'solid':
				newMaterial = createSolidMaterial(cache.original)
				break
			case 'materialPreview':
				newMaterial = createMaterialPreviewMaterial(cache.original)
				break
			case 'rendered':
				newMaterial = cache.original
				break
			default:
				return
		}

		mesh.material = newMaterial
		cache.current = newMaterial
	}

	/**
	 * Creates wireframe materials for the given original materials.
	 * Handles both single materials and material arrays.
	 *
	 * @param original - The original material(s) to base the wireframe on
	 * @returns Wireframe material(s) with the same color and transparency
	 */
	function createWireframeMaterial(
		original: THREE.Material | THREE.Material[]
	): THREE.Material | THREE.Material[] {
		if (Array.isArray(original)) {
			return original.map((mat) => createSingleWireframeMaterial(mat))
		}
		return createSingleWireframeMaterial(original)
	}

	/**
	 * Creates a single wireframe material from an original material.
	 * Preserves color, transparency, and opacity properties.
	 *
	 * @param original - The original material
	 * @returns A new MeshBasicMaterial with wireframe enabled
	 */
	function createSingleWireframeMaterial(original: THREE.Material): THREE.Material {
		const wireframeMat = new THREE.MeshBasicMaterial({
			color: (original as THREE.MeshBasicMaterial).color || 0x00ff00,
			wireframe: true,
			transparent: (original as THREE.MeshBasicMaterial).transparent,
			opacity: (original as THREE.MeshBasicMaterial).opacity
		})
		return wireframeMat
	}

	/**
	 * Creates solid materials for the given original materials.
	 * Solid mode uses flat shading with basic Lambertian lighting.
	 *
	 * @param original - The original material(s) to base the solid materials on
	 * @returns Solid material(s) with flat shading
	 */
	function createSolidMaterial(
		original: THREE.Material | THREE.Material[]
	): THREE.Material | THREE.Material[] {
		if (Array.isArray(original)) {
			return original.map((mat) => createSingleSolidMaterial(mat))
		}
		return createSingleSolidMaterial(original)
	}

	/**
	 * Creates a single solid material from an original material.
	 * Uses MeshLambertMaterial with flat shading for geometric clarity.
	 *
	 * @param original - The original material
	 * @returns A new MeshLambertMaterial with flat shading
	 */
	function createSingleSolidMaterial(original: THREE.Material): THREE.Material {
		const solidMat = new THREE.MeshLambertMaterial({
			color:
				original instanceof THREE.MeshBasicMaterial || original instanceof THREE.MeshLambertMaterial
					? (original as THREE.MeshBasicMaterial).color
					: 0xcccccc,
			flatShading: true,
			transparent: (original as THREE.MeshBasicMaterial).transparent,
			opacity: (original as THREE.MeshBasicMaterial).opacity
		})
		return solidMat
	}

	/**
	 * Creates material preview materials for the given original materials.
	 * Material preview mode uses physically-based rendering (PBR).
	 *
	 * @param original - The original material(s) to convert to PBR materials
	 * @returns PBR material(s) suitable for material preview
	 */
	function createMaterialPreviewMaterial(
		original: THREE.Material | THREE.Material[]
	): THREE.Material | THREE.Material[] {
		if (Array.isArray(original)) {
			return original.map((mat) => createSingleMaterialPreviewMaterial(mat))
		}
		return createSingleMaterialPreviewMaterial(original)
	}

	/**
	 * Creates a single material preview material from an original material.
	 * Converts to MeshStandardMaterial for PBR rendering, preserving textures and colors.
	 *
	 * @param original - The original material
	 * @returns A MeshStandardMaterial for PBR preview
	 */
	function createSingleMaterialPreviewMaterial(original: THREE.Material): THREE.Material {
		if (
			original instanceof THREE.MeshStandardMaterial ||
			original instanceof THREE.MeshPhysicalMaterial
		) {
			// Already PBR, clone it
			return original.clone()
		} else {
			// Convert to standard material
			const standardMat = new THREE.MeshStandardMaterial({
				color: (original as THREE.MeshBasicMaterial).color || 0xffffff,
				map: (original as THREE.MeshBasicMaterial).map,
				roughness: 0.5,
				metalness: 0.0,
				transparent: (original as THREE.MeshBasicMaterial).transparent,
				opacity: (original as THREE.MeshBasicMaterial).opacity
			})
			return standardMat
		}
	}

	function init(newScene: THREE.Scene) {
		scene = newScene
		solidModeLights.forEach((item) => scene?.add(item))
		cacheOriginalMaterials()

		loadWorldTexture('forest').then((map) => {
			if (!map) return
			setEnvironmentMap(map)
			setMode(currentMode.value)
		})
	}

	function setSceneLightsVisibility(val: boolean) {
		if (!scene) return
		scene.traverse((obj: LightHelper | THREE.Object3D) => {
			if ('light' in obj && obj.userData.isSceneLight) {
				obj.light.visible = val
			}
		})
	}

	function getMaterial(mesh: THREE.Mesh) {
		const cache = materialCache.get(mesh.uuid)
		return cache
	}

	function updateMaterial(mesh: THREE.Mesh, data: { prop: string; value: unknown }) {
		const cache = materialCache.get(mesh.uuid)
		if (!cache) return
		if (Array.isArray(cache.original)) return

		const originalMaterial = cache.original as unknown as Record<string, unknown>
		updateMaterialProperty(originalMaterial, data.prop, data.value)

		if (
			currentMode.value === 'materialPreview' &&
			cache.current !== cache.original &&
			!Array.isArray(cache.current)
		) {
			const currentMaterial = cache.current as unknown as Record<string, unknown>

			if (data.prop in currentMaterial) {
				updateMaterialProperty(currentMaterial, data.prop, data.value)
			}
		}

		// Trigger material update to ensure Three.js recognizes the change
		if (cache.current instanceof THREE.Material) {
			cache.current.needsUpdate = true
		}
	}

	/**
	 * Updates a material property, handling special cases like Color objects.
	 * This ensures proper updates for all property types including Colors, Vectors, etc.
	 */
	function updateMaterialProperty(material: Record<string, unknown>, prop: string, value: unknown) {
		const currentValue = material[prop]

		if (currentValue instanceof THREE.Color && value instanceof THREE.Color) {
			currentValue.copy(value)
		} else if (currentValue instanceof THREE.Vector2 && value instanceof THREE.Vector2) {
			currentValue.copy(value)
		} else if (currentValue instanceof THREE.Vector3 && value instanceof THREE.Vector3) {
			currentValue.copy(value)
		} else if (currentValue instanceof THREE.Vector4 && value instanceof THREE.Vector4) {
			currentValue.copy(value)
		} else {
			material[prop] = value
		}
	}

	function changeMaterial(mesh: THREE.Mesh, newMaterial: THREE.Material) {
		const cache = materialCache.get(mesh.uuid)
		if (!cache) return
		cache.current = newMaterial
		cache.original = newMaterial
		applyModeToMesh(mesh, currentMode.value)
	}

	return {
		init,
		cacheNewObjectMaterials,
		setEnvironmentMap,
		setMode,
		shadingMode,
		getMaterial,
		updateMaterial,
		changeMaterial
	}
})

function getSolidShadingLights() {
	// Ambient light for overall illumination
	const ambient = new THREE.AmbientLight(0xffffff, 1)
	ambient.name = 'SolidModeAmbientLight'

	// Main directional light (key light)
	const mainLight = new THREE.DirectionalLight(0xffffff, 0.8)
	mainLight.name = 'SolidModeMainLight'
	mainLight.position.set(5, 5, 5)

	// Fill directional light for softer lighting
	const fillLight = new THREE.DirectionalLight(0xffffff, 0.3)
	fillLight.name = 'SolidModeFillLight'
	fillLight.position.set(-5, -5, -5)

	const lights = [ambient, mainLight, fillLight]

	lights.forEach((item) => {
		item.userData = {
			isSceneLight: true,
			isHelper: true
		}
	})

	return lights
}

if (import.meta.hot) {
	import.meta.hot.accept(acceptHMRUpdate(useShadingStore, import.meta.hot))
}

/**
 * Represents the different shading modes available, replicating Blender's viewport shading options.
 */
export type ShadingMode = 'wireframe' | 'solid' | 'materialPreview' | 'rendered'

/**
 * Internal cache for storing original and current materials for each mesh.
 */
interface MaterialCache {
	original: THREE.Material | THREE.Material[]
	current: THREE.Material | THREE.Material[]
}
