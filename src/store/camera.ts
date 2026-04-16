import THREE from '@/three'
import { createCamera } from '@/three/modules/camera/create'
import { defineStore } from 'pinia'
import { computed, ref, shallowRef, watch } from 'vue'
import { useThreeStore } from './three'
import { getUserData } from '@/three/utils'

export const useCameraStore = defineStore('camera', () => {
	const viewportCameras = {
		perspective: createCamera({
			type: 'Perspective',
			fov: 39.6,
			near: 0.1,
			far: 1000,
			name: 'Perspective Viewport Camera'
		}),
		orthographic: createCamera({
			type: 'Orthographic',
			near: -1000,
			far: 1000,
			name: 'Orthographic Viewport Camera'
		})
	} as const

	const viewportCameraType = ref<keyof typeof viewportCameras>('perspective')

	const activeCamera = ref<THREE.PerspectiveCamera | THREE.OrthographicCamera>(
		viewportCameras[viewportCameraType.value]
	)

	const renderCamera = shallowRef<THREE.Camera | null>(null)

	const renderCameraList = computed(() => {
		const threeStore = useThreeStore()
		return threeStore.sceneChildren.filter(
			(obj) => obj instanceof THREE.Camera && getUserData(obj).isRenderCamera
		) as THREE.Camera[]
	})

	watch(viewportCameraType, (newVal, oldVal) => {
		viewportCameras[newVal].position.copy(viewportCameras[oldVal].position)
		viewportCameras[newVal].quaternion.copy(viewportCameras[oldVal].quaternion)
		viewportCameras[newVal].scale.copy(viewportCameras[oldVal].scale)
		activeCamera.value = viewportCameras[newVal]
	})

	activeCamera.value.position.set(8, 8, 8)
	activeCamera.value.lookAt(0, 0, 0)

	function switchViewportCamera() {
		if (viewportCameraType.value === 'orthographic') {
			viewportCameraType.value = 'perspective'
		} else {
			viewportCameraType.value = 'orthographic'
		}
	}

	function setRenderCamera(uuid: string) {
		const { scene } = useThreeStore()
		const camera = scene.getObjectByProperty('uuid', uuid)
		if (!(camera instanceof THREE.Camera))
			return console.warn('setRenderCamera: object is not a camera')
		renderCamera.value = camera
	}

	function toggleCameraView() {
		if (!renderCamera.value || renderCamera.value.uuid === activeCamera.value.uuid) {
			activeCamera.value = viewportCameras[viewportCameraType.value]
			return
		}

		activeCamera.value = renderCamera.value as THREE.PerspectiveCamera | THREE.OrthographicCamera
	}

	return {
		activeCamera,
		switchViewportCamera,
		viewportCameraType,
		renderCamera,
		setRenderCamera,
		renderCameraList,
		toggleCameraView
	}
})
