import THREE from '@/three'
import { useEventListener } from '@vueuse/core'
import type { ShallowRef } from 'vue'

export function setRaycaster(canvas: ShallowRef<HTMLCanvasElement | null>) {
	const raycaster = new THREE.Raycaster()
	const pointer = new THREE.Vector2()
	raycaster.firstHitOnly = true
	useEventListener(canvas, 'pointermove', (e) => {
		const target = e.target as HTMLElement
		if (!target) return
		pointer.x = (e.offsetX / target.clientWidth) * 2 - 1
		pointer.y = -(e.offsetY / target.clientHeight) * 2 + 1
	})
	return { raycaster, pointer }
}
