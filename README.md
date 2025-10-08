# Vue Mixeur

A web-based 3D editor and visualization tool built with Vue.js and Three.js. Vue Mixeur provides an intuitive interface for 3D modeling, object manipulation, and scene management directly in the browser.

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

## Tech Stack

- **Frontend**: Vue 3 with Composition API
- **3D Engine**: Three.js with BVH acceleration for fast raycasting
- **State Management**: Pinia
- **Styling**: Tailwind CSS
- **Build Tool**: Vite
- **TypeScript**: Full type safety

## License

MIT License - Copyright (c) 2025 Danil Popov
