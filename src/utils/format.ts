export function bytesToSize(bytes: number) {
	const sizes = ['Bytes', 'KB', 'MB', 'GB']
	if (bytes <= 0) return 'n/a'
	const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)).toString(), 10)
	if (i === 0) return `${bytes} ${sizes[i]})`
	if (i > 3) return `${(bytes / 1024 ** 3).toFixed(1)} ${sizes[3]}`
	return `${(bytes / 1024 ** i).toFixed(1)} ${sizes[i]}`
}
