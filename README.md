# Vue Mixeur

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Vue](https://img.shields.io/badge/Vue-3.5.22-4FC08D.svg)](https://vuejs.org/)
[![Three.js](https://img.shields.io/badge/Three.js-0.180.0-049EF4.svg)](https://threejs.org/)
[![Vite](https://img.shields.io/badge/Vite-7.1.10-646CFF.svg)](https://vitejs.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-3178C6.svg)](https://www.typescriptlang.org/)

A Blender-like web-based 3D editor built with Vue.js and Three.js. Vue Mixeur provides an interface for 3D modeling, object manipulation, and scene management directly in the browser.

## Demo

Try the live demo at [mixeur.zabastx.ru](https://mixeur.zabastx.ru)

## Features

- **3D Viewport**: Interactive 3D scene with multiple camera perspectives (perspective/orthographic)
- **Object Selection & Transformation**: Click to select objects, with transform gizmos for position, rotation, and scale
- **Shading Modes**: Switch between rendered, solid, wireframe, and texture shading views
- **Model Import**: Load 3D models in various formats (GLTF, OBJ, etc.)
- **Scene Management**: Outliner panel for hierarchical object organization
- **Properties Panel**: Inspect and modify object properties, materials, and transforms
- **Blender-style Controls**: Familiar navigation and interaction patterns
- **Real-time Rendering**: Hardware-accelerated rendering with post-processing effects
- **BVH Acceleration**: Fast raycasting and collision detection using Bounding Volume Hierarchy
- **Light Management**: Built-in lighting system with helper visualization
- **Performance Monitoring**: Real-time stats display in development mode

## Usage

### Basic Controls

- **Navigation**: Use mouse to orbit, pan, and zoom in the 3D viewport
- **Selection**: Click on objects in the viewport to select them
- **Transformation**: Use the transform gizmos to move, rotate, or scale selected objects
- **Import Models**: Import models from the menu (File > Import > file format)

### Keyboard Shortcuts

- `G`: Move mode
- `R`: Rotate mode
- `S`: Scale mode
- `Delete`: Remove selected object

### Supported File Formats

- GLTF/GLB
- OBJ

## API Documentation

Vue Mixeur uses a composable-based architecture with Pinia for state management. Key stores and composables:

### Stores

- `useThreeStore`: Main Three.js scene management
- `useAppStore`: Application state and UI controls
- `useProgressStore`: Loading progress tracking

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run type-check` - Run TypeScript type checking
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues
- `npm run format` - Format code with Prettier

### Project Structure

```
src/
├── components/          # Vue components
│   ├── data/           # Data panels (outliner, properties)
│   ├── header/         # Top navigation
│   ├── icons/          # Icon components
│   ├── input/          # Form inputs
│   ├── modals/         # Modal dialogs
│   ├── sidebar/        # Right sidebar
│   ├── status/         # Status bar
│   ├── utils/          # Utility components
│   └── viewport/       # 3D viewport
├── composables/        # Vue composables
├── store/              # Pinia stores
├── three/              # Three.js utilities
│   ├── modules/          # Scene management, loaders, etc.
│   └── index.ts        # Three.js setup with BVH
└── assets/             # Static assets
```

### Code Style

This project uses:

- **ESLint** for code linting
- **Prettier** for code formatting
- **Husky** for pre-commit hooks
- **lint-staged** for running linters on staged files

## Tech Stack

- **Frontend**: Vue 3 with Composition API
- **3D Engine**: Three.js with BVH acceleration for fast raycasting
- **State Management**: Pinia
- **Styling**: Tailwind CSS
- **Build Tool**: Vite
- **TypeScript**: Full type safety
- **UI Components**: Reka UI
- **Icons**: Custom SVG icon system

## Dependencies

### Core Dependencies

- `three`: 3D graphics library
- `three-mesh-bvh`: Bounding Volume Hierarchy for fast raycasting
- `three-viewport-gizmo`: Camera navigation gizmo
- `vue`: Progressive JavaScript framework
- `pinia`: State management for Vue
- `@vueuse/core`: Collection of Vue composition utilities

### Development Dependencies

- `vite`: Fast build tool and dev server
- `typescript`: TypeScript compiler
- `eslint`: Code linting
- `prettier`: Code formatting
- `husky`: Git hooks
- `lint-staged`: Run linters on staged files

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## License

MIT License - Copyright (c) 2025 Danil Popov

See [LICENSE](LICENSE) for more details.

## Acknowledgments

- [Three.js](https://threejs.org/) - 3D graphics library
- [Vue.js](https://vuejs.org/) - Progressive JavaScript framework
- [Blender](https://www.blender.org/) - Inspiration for UI/UX patterns
- [three-mesh-bvh](https://github.com/gkjohnson/three-mesh-bvh) - BVH acceleration
- [three-viewport-gizmo](https://github.com/JamesLMilner/three-viewport-gizmo) - Camera gizmo
- [ui.blender.org/icons](https://ui.blender.org/icons) - Blender Icons

## Contact

- **Author**: Danil Popov
- **Website**: [zabastx.ru](https://zabastx.ru)
- **GitHub**: [zabastx](https://github.com/zabastx)
