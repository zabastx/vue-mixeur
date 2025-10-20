import THREE from '@/three'

export let pmremGenerator: THREE.PMREMGenerator | null = null

export function initPMREMGenerator(renderer: THREE.WebGLRenderer) {
	pmremGenerator = new THREE.PMREMGenerator(renderer)
	pmremGenerator.compileEquirectangularShader()
}
