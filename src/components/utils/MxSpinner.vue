<template>
	<div class="absolute inset-0 z-10 flex items-center justify-center bg-black/50">
		<div class="flex items-center gap-2 text-white">
			<div class="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
			<div>
				<slot></slot>
			</div>
		</div>
	</div>
</template>
