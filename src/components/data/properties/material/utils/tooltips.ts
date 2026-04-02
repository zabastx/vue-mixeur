import type { MxTooltipContent } from '@/components/utils/MxTooltip.vue'

export const materialTooltipMap: ReadonlyMap<string, MxTooltipContent> = new Map([
	['color', { text: 'Color of the material' }],
	[
		'alphaMap',
		{
			text: `The alpha map is a grayscale texture that controls the opacity across the surface
			(black: fully transparent; white: fully opaque)`
		}
	],
	[
		'metalness',
		{
			text: `How much the material is like a metal.
			Non-metallic materials such as wood or stone use 0.0, metallic use 1.0, with nothing (usually) in between.
			A value between 0 and 1 could be used for a rusty metal look.
			If Metalness Map is also provided, both values are multiplied`
		}
	],
	[
		'metalnessMap',
		{
			text: `The blue channel of this texture is used to alter the metalness of the material`
		}
	],
	[
		'roughness',
		{
			text: `How rough the material appears. 0.0 means a smooth mirror reflection, 1.0 means fully diffuse.
			If Roughness Map is also provided, both values are multiplied`
		}
	],
	[
		'roughnessMap',
		{
			text: `The green channel of this texture is used to alter the roughness of the material`
		}
	],
	[
		'ior',
		{
			text: `Index Of Refraction for non-metallic materials, from 1.0 to 2.333`
		}
	],
	[
		'bumpMap',
		{
			text: `The texture to create a bump map.
			The black and white values map to the perceived depth in relation to the lights.
			Bump doesn't actually affect the geometry of the object, only the lighting.
			If a normal map is defined this will be ignored`
		}
	],
	[
		'bumpScale',
		{
			text: `How much the bump map affects the material`
		}
	],
	[
		'side',
		{
			text: `Defines which side of faces will be rendered`
		}
	],
	[
		'shadowSide',
		{
			text: `Defines which side of faces cast shadows`
		}
	],
	[
		'vertexColors',
		{
			text: `If checked, vertex colors should be used.
			The engine supports RGB and RGBA vertex colors depending on whether a three (RGB)
			or four (RGBA) component color buffer attribute is used`
		}
	],
	[
		'anisotropyMap',
		{
			text: `Red and green channels represent the anisotropy direction in [-1, 1] tangent, bitangent space, to be rotated by anisotropy rotation.
			The blue channel contains strength as [0, 1] to be multiplied by anisotropy`
		}
	],
	[
		'anisotropyRotation',
		{
			text: `The rotation of the anisotropy in tangent, bitangent space, measured in degrees counter-clockwise from the tangent.
			When Anisotropy Map is present, this property provides additional rotation to the vectors in the texture`
		}
	],
	[
		'aoMapIntensity',
		{
			title: 'Intensity of the ambient occlusion effect',
			text: `Range is [0,1], where 0 disables ambient occlusion.
			Where intensity is 1 and the AO map's red channel is also 1, ambient light is fully occluded on a surface.`
		}
	],
	[
		'transmission',
		{
			text: `Degree of transmission (or optical transparency), from 0.0 to 1.0
			Thin, transparent or semitransparent, plastic or glass materials remain largely reflective even if they are fully transmissive.
			The transmission property can be used to model these materials.
			When transmission is non-zero, opacity should be set to 1`
		}
	],
	[
		'transmissionMap',
		{
			text: `The red channel of this texture is multiplied against transmission, for per-pixel control over optical transparency`
		}
	],
	[
		'thickness',
		{
			text: `The thickness of the volume beneath the surface. The value is given in the coordinate space of the mesh.
			If the value is 0 the material is thin-walled. Otherwise the material is a volume boundary`
		}
	],
	[
		'reflectivity',
		{
			text: `Degree of reflectivity, from 0.0 to 1.0.
			Default is 0.5, which corresponds to an index-of-refraction of 1.5.
			This models the reflectivity of non-metallic materials. It has no effect when metalness is 1.0`
		}
	],
	[
		'shadowSide',
		{
			text: `Defines which side of faces cast shadows.
			If 'Default', the side casting shadows is determined as follows:
			- When material side is set to Front Side, the back side cast shadows.
			- When material side is set to Back Side, the front side cast shadows.
			- When material side is set to Double Side, both sides cast shadows.`
		}
	],
	[
		'dithering',
		{
			text: `Whether to apply dithering to the color to remove the appearance of banding`
		}
	],
	[
		'specularColor',
		{
			text: `Tints the specular reflection at normal incidence for non-metals only`
		}
	],
	[
		'specularColorMap',
		{
			text: `The RGB channels of this texture are multiplied against Specular Color, for per-pixel control over specular color`
		}
	],
	[
		'specularIntensity',
		{
			text: `A float that scales the amount of specular reflection for non-metals only.
			When set to zero, the model is effectively Lambertian`
		}
	],
	[
		'specularIntensityMap',
		{
			text: `The alpha channel of this texture is multiplied against Specular Intensity, for per-pixel control over specular intensity`
		}
	],
	[
		'sheenColorMap',
		{
			text: `The RGB channels of this texture are multiplied against Sheen Color, for per-pixel control over sheen tint`
		}
	],
	[
		'sheenRoughnessMap',
		{
			text: `The alpha channel of this texture is multiplied against Sheen Roughness, for per-pixel control over sheen roughness`
		}
	],
	[
		'clearcoat',
		{
			text: `Represents the intensity of the clear coat layer.
			Use clear coat related properties to enable multilayer materials that have a thin translucent layer over the base layer`
		}
	],
	[
		'clearcoatMap',
		{
			text: `The red channel of this texture is multiplied against Coat Intensity, for per-pixel control over a coating's intensity`
		}
	],
	[
		'clearcoatNormalMap',
		{
			text: `Can be used to enable independent normals for the clear coat layer`
		}
	],
	[
		'clearcoatRoughnessMap',
		{
			text: `The green channel of this texture is multiplied against Coat Roughness, for per-pixel control over a coating's roughness`
		}
	],
	[
		'iridescence',
		{
			text: `The intensity of the iridescence layer, simulating RGB color shift based on the angle between the surface and the viewer`
		}
	],
	[
		'iridescenceIOR',
		{
			text: `Strength of the iridescence RGB color shift effect, represented by an index-of-refraction`
		}
	],
	[
		'iridescenceMap',
		{
			text: `The red channel of this texture is multiplied against Iridescence Intensity, for per-pixel control over iridescence`
		}
	],
	[
		'emissive',
		{
			text: `Emissive (light) color of the material, essentially a solid color unaffected by other lighting`
		}
	],
	[
		'emissiveMap',
		{
			text: `The emissive map color is modulated by the Emission Color and the Emission Intensity. If you have an emissive map, be sure to set the emissive color to something other than black`
		}
	],
	[
		'fog',
		{
			text: `Whether the material is affected by fog or not`
		}
	]
])
