<template>
	<DialogRoot>
		<DialogTrigger>
			<slot></slot>
		</DialogTrigger>
		<DialogPortal>
			<DialogOverlay class="fixed inset-0 bg-black/50 backdrop-blur-sm" />
		</DialogPortal>
	</DialogRoot>
</template>

<script lang="ts" setup></script>

<style scoped></style>
