import THREE from '@/three'

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

/**
 * A utility class for managing different shading modes in a Three.js scene,
 * replicating Blender's viewport shading functionality.
 *
 * This class allows switching between wireframe, solid, material preview, and rendered modes
 * by dynamically changing mesh materials while preserving the original materials for restoration.
 *
 * @example
 * ```typescript
 * const shadingModes = new ShadingControls(scene)
 * shadingModes.setMode('wireframe')
 * ```
 */
export class ShadingControls {
	private scene: THREE.Scene
	private materialCache = new Map<THREE.Mesh, MaterialCache>()
	private currentMode: ShadingMode = 'solid'

	/**
	 * Creates a new ShadingControls instance for the given scene.
	 *
	 * @param scene - The Three.js scene containing meshes to manage shading for
	 */
	constructor(scene: THREE.Scene) {
		this.scene = scene
		this.cacheOriginalMaterials()
	}

	/**
	 * Determines if an object should be affected by shading modes.
	 * Only objects explicitly marked as shadable will be affected by shading changes.
	 * Uses userData.isShadable to identify objects that should respond to shading modes.
	 *
	 * @param object - The object to check
	 * @returns True if the object should be shaded, false otherwise
	 */
	private shouldShadeObject(object: THREE.Object3D): boolean {
		// Only objects explicitly marked as shadable will be affected
		return !!object.userData.isShadable
	}

	/**
	 * Caches the original materials of all meshes in the scene.
	 * This allows restoring the original materials when switching back to 'rendered' mode.
	 * Only caches materials for objects marked as shadable.
	 */
	private cacheOriginalMaterials() {
		this.scene.traverse((object) => {
			if (object instanceof THREE.Mesh && object.material && this.shouldShadeObject(object)) {
				this.cacheMeshMaterials(object)
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
	public cacheNewObjectMaterials(object: THREE.Object3D) {
		object.traverse((child) => {
			if (
				child instanceof THREE.Mesh &&
				child.material &&
				!this.materialCache.has(child) &&
				this.shouldShadeObject(child)
			) {
				this.cacheMeshMaterials(child)
				// Apply current shading mode to the new mesh
				this.applyModeToMesh(child, this.currentMode)
			}
		})
	}

	/**
	 * Caches materials for a single mesh.
	 *
	 * @param mesh - The mesh to cache materials for
	 */
	private cacheMeshMaterials(mesh: THREE.Mesh) {
		if (!mesh.material) return

		const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material]
		const originalMaterials = materials.map((mat) => mat.clone())
		this.materialCache.set(mesh, {
			original: Array.isArray(mesh.material) ? originalMaterials : originalMaterials[0]!,
			current: mesh.material
		})
	}

	/**
	 * Sets the shading mode for all meshes in the scene.
	 *
	 * @param mode - The shading mode to apply ('wireframe', 'solid', 'materialPreview', or 'rendered')
	 *
	 * @example
	 * ```typescript
	 * shadingModes.setMode('wireframe')  // Show wireframe
	 * shadingModes.setMode('solid')      // Show solid shading
	 * shadingModes.setMode('rendered')   // Show full rendering
	 * ```
	 */
	setMode(mode: ShadingMode) {
		if (this.currentMode === mode) return
		this.currentMode = mode

		this.scene.traverse((object) => {
			if (object instanceof THREE.Mesh) {
				this.applyModeToMesh(object, mode)
			}
		})
	}

	/**
	 * Applies the specified shading mode to a single mesh.
	 *
	 * @param mesh - The mesh to apply the shading mode to
	 * @param mode - The shading mode to apply
	 */
	private applyModeToMesh(mesh: THREE.Mesh, mode: ShadingMode) {
		const cache = this.materialCache.get(mesh)
		if (!cache) return

		let newMaterial: THREE.Material | THREE.Material[]

		switch (mode) {
			case 'wireframe':
				newMaterial = this.createWireframeMaterial(cache.original)
				break
			case 'solid':
				newMaterial = this.createSolidMaterial(cache.original)
				break
			case 'materialPreview':
				newMaterial = this.createMaterialPreviewMaterial(cache.original)
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
	private createWireframeMaterial(
		original: THREE.Material | THREE.Material[]
	): THREE.Material | THREE.Material[] {
		if (Array.isArray(original)) {
			return original.map((mat) => this.createSingleWireframeMaterial(mat))
		}
		return this.createSingleWireframeMaterial(original)
	}

	/**
	 * Creates a single wireframe material from an original material.
	 * Preserves color, transparency, and opacity properties.
	 *
	 * @param original - The original material
	 * @returns A new MeshBasicMaterial with wireframe enabled
	 */
	private createSingleWireframeMaterial(original: THREE.Material): THREE.Material {
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
	private createSolidMaterial(
		original: THREE.Material | THREE.Material[]
	): THREE.Material | THREE.Material[] {
		if (Array.isArray(original)) {
			return original.map((mat) => this.createSingleSolidMaterial(mat))
		}
		return this.createSingleSolidMaterial(original)
	}

	/**
	 * Creates a single solid material from an original material.
	 * Uses MeshLambertMaterial with flat shading for geometric clarity.
	 *
	 * @param original - The original material
	 * @returns A new MeshLambertMaterial with flat shading
	 */
	private createSingleSolidMaterial(original: THREE.Material): THREE.Material {
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
	private createMaterialPreviewMaterial(
		original: THREE.Material | THREE.Material[]
	): THREE.Material | THREE.Material[] {
		if (Array.isArray(original)) {
			return original.map((mat) => this.createSingleMaterialPreviewMaterial(mat))
		}
		return this.createSingleMaterialPreviewMaterial(original)
	}

	/**
	 * Creates a single material preview material from an original material.
	 * Converts to MeshStandardMaterial for PBR rendering, preserving textures and colors.
	 *
	 * @param original - The original material
	 * @returns A MeshStandardMaterial for PBR preview
	 */
	private createSingleMaterialPreviewMaterial(original: THREE.Material): THREE.Material {
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
	getCurrentMode(): ShadingMode {
		return this.currentMode
	}
}
