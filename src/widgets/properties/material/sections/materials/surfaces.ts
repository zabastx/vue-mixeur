import MatSurfaceBasic from './MatSurfaceBasic.vue'
import MatSurfaceLambert from './MatSurfaceLambert.vue'
import MatSurfaceNormal from './MatSurfaceNormal.vue'
import MatSurfacePhong from './MatSurfacePhong.vue'
import MatSurfacePhysical from './MatSurfacePhysical.vue'
import MatSurfaceStandard from './MatSurfaceStandard.vue'
import MatSurfaceToon from './MatSurfaceToon.vue'

export const MATERIAL_SURFACES = [
	{
		label: 'Standard Material',
		value: 'MeshStandardMaterial',
		component: MatSurfaceStandard,
		tooltip: {
			text: 'A standard physically based material, using Metallic-Roughness workflow'
		}
	},
	{
		label: 'Physical Material',
		value: 'MeshPhysicalMaterial',
		component: MatSurfacePhysical,
		tooltip: {
			text: `An extension of the Standard Material, providing more advanced physically-based rendering properties`
		}
	},
	{
		label: 'Phong Material',
		value: 'MeshPhongMaterial',
		component: MatSurfacePhong,
		tooltip: {
			text: 'A material for shiny surfaces with specular highlights'
		}
	},
	{
		label: 'Toon Material',
		value: 'MeshToonMaterial',
		component: MatSurfaceToon,
		tooltip: {
			text: 'A material implementing toon shading'
		}
	},
	{
		label: 'Lambert Material',
		value: 'MeshLambertMaterial',
		component: MatSurfaceLambert,
		tooltip: {
			text: 'A material for non-shiny surfaces, without specular highlights'
		}
	},
	{
		label: 'Normal Material',
		value: 'MeshNormalMaterial',
		component: MatSurfaceNormal,
		tooltip: {
			text: 'A material that maps the normal vectors to RGB colors'
		}
	},
	{
		label: 'Basic Material',
		value: 'MeshBasicMaterial',
		component: MatSurfaceBasic,
		tooltip: {
			text: `A material for drawing geometries in a simple shaded way.
			This material is not affected by lights`
		}
	}
] as const
