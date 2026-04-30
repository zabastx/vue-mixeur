export function emitCustomEvent<K extends keyof DocumentEventMap>(
	type: K,
	detail?: DocumentEventMap[K] extends CustomEvent<infer D> ? D : never
) {
	document.dispatchEvent(new CustomEvent(type, { detail }))
}

export function listenCustomEvent<K extends keyof DocumentEventMap>(
	type: K,
	handler: (e: DocumentEventMap[K]) => void
) {
	document.addEventListener(type, handler)
	return () => document.removeEventListener(type, handler)
}
