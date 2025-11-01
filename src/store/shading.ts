import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import THREE from '@/three'
import { loadWorldTexture } from '@/three/modules/loaders/environment'
import type { LightHelper } from '@/three/modules/light'

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

export const useShadingStore = defineStore('shading', () => {
	const scene = ref<THREE.Scene>()
	const materialCache = ref(new Map<THREE.Mesh, MaterialCache>())
	const currentMode = ref<ShadingMode>('solid')
	const environmentMap = ref<THREE.Texture | null>(null)
	const solidModeLights = getSolidShadingLights()

	/**
	 * Determines if an object should be affected by shading modes.
	 * Only objects explicitly marked as shadable will be affected by shading changes.
	 * Uses userData.isShadable to identify objects that should respond to shading modes.
	 *
	 * @param object - The object to check
	 * @returns True if the object should be shaded, false otherwise
	 */
	const shouldShadeObject = (object: THREE.Object3D): boolean => {
		// Only objects explicitly marked as shadable will be affected
		return !!object.userData.isShadable
	}

	/**
	 * Caches the original materials of all meshes in the scene.
	 * This allows restoring the original materials when switching back to 'rendered' mode.
	 * Only caches materials for objects marked as shadable.
	 */
	const cacheOriginalMaterials = () => {
		if (!scene.value) return
		scene.value.traverse((object) => {
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
	const cacheNewObjectMaterials = (object: THREE.Object3D) => {
		object.traverse((child) => {
			if (
				child instanceof THREE.Mesh &&
				child.material &&
				!materialCache.value.has(child) &&
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
	const cacheMeshMaterials = (mesh: THREE.Mesh) => {
		if (!mesh.material) return

		const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material]
		const originalMaterials = materials.map((mat) => mat.clone())
		materialCache.value.set(mesh, {
			original: Array.isArray(mesh.material) ? originalMaterials : originalMaterials[0]!,
			current: mesh.material
		})
	}

	/**
	 * Sets the shading mode for all meshes in the scene.
	 *
	 * @param mode - The shading mode to apply ('wireframe', 'solid', 'materialPreview', or 'rendered')
	 */
	const setMode = (mode: ShadingMode) => {
		if (currentMode.value === mode) return
		currentMode.value = mode

		if (mode === 'materialPreview') {
			if (scene.value) scene.value.environment = environmentMap.value
		} else {
			if (scene.value) scene.value.environment = null
		}

		if (!scene.value) return
		scene.value.traverse((object) => {
			if (object instanceof THREE.Mesh) {
				applyModeToMesh(object, mode)
			}
		})
	}

	const setEnvironmentMap = (map: THREE.Texture) => {
		environmentMap.value = map
	}

	/**
	 * Applies the specified shading mode to a single mesh.
	 *
	 * @param mesh - The mesh to apply the shading mode to
	 * @param mode - The shading mode to apply
	 */
	const applyModeToMesh = (mesh: THREE.Mesh, mode: ShadingMode) => {
		const cache = materialCache.value.get(mesh)
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
	const createWireframeMaterial = (
		original: THREE.Material | THREE.Material[]
	): THREE.Material | THREE.Material[] => {
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
	const createSingleWireframeMaterial = (original: THREE.Material): THREE.Material => {
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
	const createSolidMaterial = (
		original: THREE.Material | THREE.Material[]
	): THREE.Material | THREE.Material[] => {
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
	const createSingleSolidMaterial = (original: THREE.Material): THREE.Material => {
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
	const createMaterialPreviewMaterial = (
		original: THREE.Material | THREE.Material[]
	): THREE.Material | THREE.Material[] => {
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
	const createSingleMaterialPreviewMaterial = (original: THREE.Material): THREE.Material => {
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

	/**
	 * Gets the currently active shading mode.
	 *
	 * @returns The current shading mode
	 */
	const getCurrentMode = (): ShadingMode => {
		return currentMode.value
	}

	/**
	 * Initializes the shading store with a scene.
	 * This should be called once the scene is available.
	 *
	 * @param sceneRef - The Three.js scene
	 */
	const init = (sceneRef: THREE.Scene) => {
		scene.value = sceneRef
		cacheOriginalMaterials()
		setMode(currentMode.value)

		// Add solid mode lights immediately if in solid mode (matching original behavior)
		if (currentMode.value === 'solid') {
			solidModeLights.forEach((item) => scene.value!.add(item))
		}

		// Set scene lights visibility based on current mode
		if (currentMode.value === 'rendered') {
			setSceneLightsVisibility(scene.value, true)
		} else {
			setSceneLightsVisibility(scene.value, false)
		}

		loadWorldTexture('forest').then((map) => {
			if (!map) return
			setEnvironmentMap(map)
			// If we're in material preview mode, set the environment immediately
			if (scene.value && currentMode.value === 'materialPreview') {
				scene.value.environment = map
			}
		})
	}

	// Watch for mode changes and handle solid mode lights
	watch(currentMode, (newMode) => {
		if (!scene.value) return

		if (newMode === 'solid') {
			solidModeLights.forEach((item) => scene.value!.add(item))
		} else {
			solidModeLights.forEach((item) => scene.value!.remove(item))
		}

		if (newMode === 'rendered') {
			setSceneLightsVisibility(scene.value, true)
		} else {
			setSceneLightsVisibility(scene.value, false)
		}
	})

	return {
		currentMode,
		setMode,
		getCurrentMode,
		init,
		cacheNewObjectMaterials,
		setEnvironmentMap
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

function setSceneLightsVisibility(scene: THREE.Scene, val: boolean) {
	scene.traverse((obj: LightHelper | THREE.Object3D) => {
		if ('light' in obj && obj.userData.isSceneLight) {
			obj.light.visible = val
		}
	})
}
