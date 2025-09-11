import THREE from '@/three'

/**
 * A Three.js mesh component that renders an infinite grid helper with dual grid sizes and distance-based fading.
 *
 * This helper creates a procedurally generated grid that:
 * - Displays two grid layers (small and large spacing)
 * - Fades out lines based on camera distance
 * - Follows camera position automatically
 * - Uses shader-based rendering for performance and visual quality
 * @author @Fyrestar {@link https://github.com/Fyrestar}
 * @see {@link https://github.com/Fyrestar/THREE.InfiniteGridHelper|repo}
 */
export class InfiniteGridHelper extends THREE.Mesh {
	/**
	 * Creates a new infinite grid helper with configurable parameters.
	 *
	 * @param size1 - Size of the small grid lines (default: 1)
	 * @param size2 - Size of the large grid lines (default: 10)
	 * @param color - Color of the grid lines (default: #888888)
	 * @param distance - Maximum distance before grid lines fade out (default: 1000)
	 * @param axes - Coordinate system orientation ('xzy' for standard 3D view, 'xyz' for 2D top-down)
	 */
	constructor(
		size1 = 1,
		size2 = 10,
		color = new THREE.Color(0x888888),
		distance = 100,
		axes: 'xzy' | 'xyz' = 'xzy'
	) {
		const planeAxes = axes.substring(0, 2)
		const geometry = new THREE.PlaneGeometry(2, 2, 1, 1)

		const material = new THREE.ShaderMaterial({
			side: THREE.DoubleSide,
			transparent: true,
			opacity: 0.5,
			depthWrite: false,
			uniforms: {
				uSize1: { value: size1 },
				uSize2: { value: size2 },
				uColor: { value: color.convertSRGBToLinear() },
				uDistance: { value: distance }
			},
			vertexShader: `
				varying vec3 worldPosition;
				uniform float uDistance;
				void main() {
					vec3 pos = position.${axes} * uDistance;
					pos.${planeAxes} += cameraPosition.${planeAxes};
					worldPosition = pos;
					gl_Position = projectionMatrix * viewMatrix * vec4(pos, 1.0);
				}
			`,
			fragmentShader: `
				varying vec3 worldPosition;
				uniform float uSize1;
				uniform float uSize2;
				uniform vec3 uColor;
				uniform float uDistance;

				float getGrid(float size) {
					vec2 r = worldPosition.xz / size;
					vec2 grid = abs(fract(r - 0.5) - 0.5) / fwidth(r);
					float line = min(grid.x, grid.y);
					return 1.0 - min(line, 1.0);
				}

				void main() {
					float distFade = 1.0 - min(distance(cameraPosition, worldPosition) / uDistance, 1.0);
					float g1 = getGrid(uSize1);
					float g2 = getGrid(uSize2);
					vec3 color = uColor * mix(g2, g1, 0.5);
					float alpha = max(g1, g2) * distFade;
					gl_FragColor = vec4(color, alpha);
					if (gl_FragColor.a <= 0.0) discard;
				}
			`
		})

		super(geometry, material)
		this.frustumCulled = false
	}

	/**
	 * Updates the grid position to match the camera's current position.
	 *
	 * Ensures the grid remains centered under the camera by synchronizing their positions.
	 *
	 * @param camera - Camera whose position will be copied to the grid
	 */
	update(camera: THREE.Camera) {
		this.position.copy(camera.position)
	}
}
