import type { MxTooltipContent } from '@/shared/lib/types'

export const lightTooltipMap: ReadonlyMap<string, MxTooltipContent> = new Map([
	[
		'intensity',
		{
			text: `The light's strength/intensity measured in candela (cd)`
		}
	],
	[
		'power',
		{
			text: `Power is the luminous power of the light measured in lumens (lm).
			Changing the power will also change the light's intensity`
		}
	],
	[
		'distance',
		{
			text: `Maximum range of the light.
			0 means no limit.`
		}
	],
	[
		'penumbra',
		{
			text: `Percent of the spotlight cone that is attenuated due to penumbra`
		}
	],
	[
		'map',
		{
			text: `A texture used to modulate the color of the light.
			The spot light color is mixed with the RGB value of this texture, with a ratio corresponding to its alpha value`
		}
	]
])

export const lightShadowTooltipMap: ReadonlyMap<string, MxTooltipContent> = new Map([
	[
		'bias',
		{
			text: 'How much to add or subtract from the normalized depth when deciding whether a surface is in shadow'
		}
	],
	[
		'normalBias',
		{
			text: `Defines how much the position used to query the shadow map is offset along the object normal.
			Increasing this value can be used to reduce shadow acne especially in large scenes where light shines onto geometry at a shallow angle.
			The cost is that shadows may appear distorted`
		}
	],
	[
		'mapSize',
		{
			text: `Defines the width and height of the shadow map.
			Higher values give better quality shadows at the cost of computation time.
			Values must be powers of two`
		}
	],
	[
		'radius',
		{
			text: `Setting this to values greater than 1 will blur the edges of the shadow.
			High values will cause unwanted banding effects in the shadows - a greater map size will allow for a higher value to be used here before these effects become visible`
		}
	]
])
