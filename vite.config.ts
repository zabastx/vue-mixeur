import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import Components from 'unplugin-vue-components/vite'
import RekaResolver from 'reka-ui/resolver'
import svgLoader from 'vite-svg-loader'
import { iconTypesPlugin } from './plugins/vite-plugin-icon-types'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
	plugins: [
		vue(),
		tailwindcss(),
		Components({
			dts: 'src/components.d.ts',
			resolvers: [RekaResolver()]
		}),
		svgLoader(),
		iconTypesPlugin(),
		VitePWA({
			registerType: 'autoUpdate',
			includeAssets: [
				'favicon.ico',
				'favicon.svg',
				'favicon-96x96.png',
				'apple-touch-icon.png',
				'web-app-manifest-192x192.png',
				'web-app-manifest-512x512.png',
				'logo_og.png'
			],
			manifest: {
				name: 'Vue Mixeur',
				short_name: 'Mixeur',
				description: 'Blender-like web-based 3D editor built with Vue.js and Three.js',
				theme_color: '#303030',
				background_color: '#303030',
				display: 'standalone',
				orientation: 'landscape',
				scope: '/',
				start_url: '/',
				icons: [
					{
						src: 'web-app-manifest-192x192.png',
						sizes: '192x192',
						type: 'image/png',
						purpose: 'any maskable'
					},
					{
						src: 'web-app-manifest-512x512.png',
						sizes: '512x512',
						type: 'image/png',
						purpose: 'any maskable'
					}
				]
			},
			workbox: {
				globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2,exr}'],
				runtimeCaching: [
					{
						urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
						handler: 'CacheFirst',
						options: {
							cacheName: 'google-fonts-cache',
							expiration: {
								maxEntries: 10,
								maxAgeSeconds: 60 * 60 * 24 * 365
							},
							cacheableResponse: {
								statuses: [0, 200]
							}
						}
					},
					{
						urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
						handler: 'CacheFirst',
						options: {
							cacheName: 'gstatic-fonts-cache',
							expiration: {
								maxEntries: 10,
								maxAgeSeconds: 60 * 60 * 24 * 365
							},
							cacheableResponse: {
								statuses: [0, 200]
							}
						}
					},
					{
						urlPattern: /^https:\/\/rsms\.me\/.*/i,
						handler: 'CacheFirst',
						options: {
							cacheName: 'rsms-fonts-cache',
							expiration: {
								maxEntries: 10,
								maxAgeSeconds: 60 * 60 * 24 * 365
							},
							cacheableResponse: {
								statuses: [0, 200]
							}
						}
					},
					{
						urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp|exr)$/,
						handler: 'CacheFirst',
						options: {
							cacheName: 'image-cache',
							expiration: {
								maxEntries: 100,
								maxAgeSeconds: 60 * 60 * 24 * 30
							},
							cacheableResponse: {
								statuses: [0, 200]
							}
						}
					}
				]
			}
		})
	],
	resolve: {
		alias: {
			'@': fileURLToPath(new URL('./src', import.meta.url))
		}
	},
	build: {
		rollupOptions: {
			output: {
				manualChunks(id) {
					if (id.includes('node_modules/three/build')) return 'three'
					if (id.includes('assets/icons')) return 'icons'
				}
			}
		}
	}
})
