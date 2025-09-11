import type THREE from '@/three'
import { defineStore } from 'pinia'

export const useSelectionStore = defineStore('selection', {
	state: () => ({
		selected: [] as THREE.Object3D[]
	}),
	actions: {
		select(object: THREE.Object3D, multi = false) {
			if (!multi) {
				this.selected = [object]
			} else {
				const idx = this.selected.indexOf(object)
				if (idx >= 0) {
					this.selected.splice(idx, 1) // снять выделение
				} else {
					this.selected.push(object)
				}
			}
		},
		clear() {
			this.selected = []
		}
	}
})
