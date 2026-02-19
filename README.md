# Vue Mixeur

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Vue](https://img.shields.io/badge/Vue-3.5.28-4FC08D.svg)](https://vuejs.org/)
[![Three.js](https://img.shields.io/badge/Three.js-0.183.0-049EF4.svg)](https://threejs.org/)
[![Vite](https://img.shields.io/badge/Vite-7.3.1-646CFF.svg)](https://vitejs.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-3178C6.svg)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.2.0-06B6D4.svg)](https://tailwindcss.com/)

A Blender-like web-based 3D editor built with Vue.js and Three.js. Vue Mixeur provides an interface for 3D modeling, object manipulation, and scene management directly in the browser.

## Demo

Try the live demo at [mixeur.zabastx.ru](https://mixeur.zabastx.ru)

## Features

### Object Manipulation

- **Selection & Transformation**: Click to select objects with transform gizmos (move, rotate, scale)
- **BVH Acceleration**: Fast raycasting and collision detection using Bounding Volume Hierarchy
- **Outline Highlighting**: Visual feedback for selected objects
- **Blender-style Controls**: Familiar navigation and keyboard shortcuts

### Shading & Rendering

- **Viewport Shading Modes**: Wireframe, solid, material preview, and rendered views
- **Post-Processing Effects**: TAA (Temporal Anti-Aliasing), gamma correction, edge outlines
- **HDR Environment Maps**: Built-in environments (city, courtyard, forest, interior, night, studio, sunrise, sunset)
- **Image Rendering**: Export scenes to PNG, JPEG, or WebP with customizable resolution

### Content Creation

- **Primitive Meshes**: Create planes, cubes, circles, spheres, icospheres, cylinders, cones, and torus shapes
- **Text Objects**: 3D text with customizable fonts, size, depth, and bevel
- **Lighting System**: Point, directional, spot, and area lights with property editing
- **Material Editor**: Multiple material types (Principled BSDF, Diffuse, Glossy, Toon) with real-time editing

### Asset Management

- **Model Import**: Support for GLTF/GLB with DRACO/Meshopt compression
- **Model Export**: Export entire scenes to GLB format
- **Models Library**: Browse and import free CC0 3D models from Poly Haven
- **Texture Library**: Import and manage textures (diffuse, normal, roughness, AO, etc.)

### Scene Management

- **Outliner Panel**: Hierarchical tree view with visibility toggles
- **Properties Panel**: Edit transforms, materials, lights, geometry, and object properties
- **Loading Progress**: Visual indicators for model loading with percentage and ETA

## Usage

### Basic Controls

- **Navigation**: Use mouse to orbit, pan, and zoom in the 3D viewport
- **Selection**: Click on objects in the viewport to select them
- **Transformation**: Use the transform gizmos to move, rotate, or scale selected objects
- **Import Models**: Import models from the menu (File > Import > file format) or browse the Models Library
- **Models Library**: Access free CC0 3D models from Poly Haven with category filtering and search

### Keyboard Shortcuts

| Key        | Action                                 |
| ---------- | -------------------------------------- |
| `G`        | Move mode                              |
| `R`        | Rotate mode                            |
| `S`        | Scale mode                             |
| `Delete`   | Remove selected object                 |
| `Numpad 5` | Toggle perspective/orthographic camera |
| `Numpad 1` | Front view (Ctrl+1 for back view)      |
| `Numpad 3` | Right view (Ctrl+3 for left view)      |
| `Numpad 7` | Top view (Ctrl+7 for bottom view)      |

## Project Structure

```
src/
├── components/          # Vue components
│   ├── data/           # Data panels (outliner, properties)
│   ├── header/         # Top navigation bar
│   ├── input/          # Form input components
│   ├── modals/         # Modal dialogs
│   ├── render-image/   # Image rendering dialog
│   ├── sidebar/        # Right sidebar panel
│   ├── status/         # Bottom status bar
│   ├── utils/          # Utility components
│   └── viewport/       # 3D viewport component
├── composables/        # Vue composition functions
├── store/              # Pinia stores
├── three/              # Three.js setup and modules
├── utils/              # General utility functions
└── assets/             # Static assets
```

## Tech Stack

- **Frontend**: Vue 3 with Composition API
- **3D Engine**: Three.js with BVH acceleration for fast raycasting
- **State Management**: Pinia 3
- **Styling**: Tailwind CSS v4
- **Build Tool**: Vite 7
- **TypeScript**: Full type safety
- **UI Components**: Reka UI
- **Icons**: Custom SVG icon system
- **Testing**: Vitest (unit), Playwright (E2E)

## Core Dependencies

- `three`: 3D graphics library
- `three-mesh-bvh`: Bounding Volume Hierarchy for fast raycasting
- `three-viewport-gizmo`: Camera navigation gizmo
- `three-stdlib`: Three.js standard library extensions
- `vue`: Progressive JavaScript framework
- `pinia`: State management for Vue 3
- `@vueuse/core`: Collection of Vue composition utilities
- `@jaames/iro`: Color picker library
- `reka-ui`: Vue component primitives

## Acknowledgments

- [Three.js](https://threejs.org/) - 3D graphics library
- [Vue.js](https://vuejs.org/) - Progressive JavaScript framework
- [Blender](https://www.blender.org/) - Inspiration for UI/UX patterns
- [Poly Haven](https://polyhaven.com/) - Free CC0 3D models, HDRIs, and textures
- [three-mesh-bvh](https://github.com/gkjohnson/three-mesh-bvh) - BVH acceleration
- [three-viewport-gizmo](https://github.com/JamesLMilner/three-viewport-gizmo) - Camera gizmo
- [ui.blender.org/icons](https://ui.blender.org/icons) - Blender Icons

## License

MIT License - Copyright (c) 2025 Danil Popov

See [LICENSE](LICENSE) for more details.
