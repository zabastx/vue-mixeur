<template>
	<div ref="css" class="rounded bg-(--window-bg)">
		<div>object settings</div>
	</div>
</template>

<script lang="ts" setup>
// import { CSS3DRenderer } from 'three/addons/renderers/CSS3DRenderer.js'
// import { onMounted, useTemplateRef } from 'vue'
// import { PerspectiveCamera, Scene } from 'three'

// const css = useTemplateRef('css')

// onMounted(() => {
// 	if (!css.value) return
// 	const renderer = new CSS3DRenderer({
// 		element: css.value
// 	})

// 	const scene = new Scene()
// 	const camera = new PerspectiveCamera(70, 1, 1, 1000)
// 	camera.position.set(0, 0, 2)
// 	camera.lookAt(0, 0, 0)

// 	renderer.setSize(css.value.clientWidth, css.value.clientHeight)

// 	renderer.render(scene, camera)
// })
</script>

<style scoped></style>
