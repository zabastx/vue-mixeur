export function formatSliderValue(val: number, max: number) {
	return (Math.round((val / max) * 1000) / 1000).toPrecision(3)
}
