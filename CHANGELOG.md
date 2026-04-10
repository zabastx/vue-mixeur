# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Splash screen: Added loading screen with logo and animated loader
- Color picker transparency
  - When enabled, displays alpha field and uses hex8 color strings (e.g., `#ff000080`)
  - When disabled, uses standard hex6 strings for simpler color values
- Icon types generation: New build-time system to generate TypeScript types for SVG icons
  - New `plugins/icon-types-generator.ts` script scans `src/assets/icons/` and generates type definitions
  - New `plugins/run-gen.ts` entry point for running the generator
  - New `types:generate` npm script to auto-generate icon type definitions
  - Workflow integration: GitHub Actions now run `types:generate` before type checking

### Changed

- MxIcon: Refactored to use raw SVG import for improved performance
- Vite config: Added icons chunk for code splitting
- `type-check` script renamed to `types:check` for consistency
- `types:generate` now runs before `types:check` in CI pipelines
- tsconfig.node.json: Added `plugins/*` to file matching patterns
- Node imports: Updated to use explicit `node:` protocol prefix (`node:fs`, `node:path`)

## [0.12.0] - 2026-04-02

### Added

- Material properties: New declarative field-based configuration system for material properties
  - New `MaterialInputFields` component renders form fields from typed configuration arrays
  - New `useMeshMaterial` composable for material property access and updates
  - Support for 6 material types: Physical, Standard, Phong, Toon, Lambert, and Normal
  - Added `NormalMaterial` surface type for displaying normal vectors as RGB colors
  - Material tooltips: Comprehensive tooltips for all material properties
  - Displacement section: Displacement map, scale, and bias controls
  - Settings section: Side, shadow side, blending, depth function, fog, dithering, vertex colors, precision
- New group icon: Added `group-new.svg` icon for outliner add group action

### Changed

- Material properties: Major refactor from per-material Vue components to declarative field-based system
  - Removed 9 separate material surface component files (MatSurfaceDiffuse, MatSurfaceGlossy, MatSurfacePrincipled, MatSurfaceToon, and 5 utility components)
  - New `sections/` directory structure for material property sections (Surface, Displacement, Settings)
  - New `materials/` subdirectory for per-material-type field configurations
  - All material types now share the same accordion structure and input components
- DataOutlinerItem: Improved hover effects with brightness filter and cursor pointer
- DataOutlinerItem: Added `text-icon-object` class for consistent icon color
- SVG icon fill: Changed from hardcoded `#fff` to `currentColor` for dynamic color control via CSS theming (45 icon files across base, file, light, mesh, misc, outliner, properties, shading, ui, and view categories)
- MTL loader: Texture names now prefixed with property key and material name for better identification (e.g., `color_MyMaterial`)
- InputTexture: Changed `overflow-hidden text-ellipsis` to Tailwind `truncate` class; changed `||` to `??` for nullish coalescing

### Fixed

- MTL loader: Added `mtl.preload()` call before accessing materials to ensure proper initialization

## [0.11.2] - 2026-04-01

### Added

- Input components: Added `disabled` prop support across InputField, InputNumber, InputTexture, and related components
- InputSelect: Added tooltip support for individual options
- MxTooltip: Added `whitespace-pre-line` CSS for multi-line tooltip text rendering
- InputField: Proper `<label>` element with `useId()` for improved accessibility

### Changed

- MxAccordionItem: Improved header styling with hover brightness effect; reorganized padding from header to trigger; added conditional left padding for nested items
- InputTexture: Close button now uses MxIcon component instead of text "x"
- InputNumber: Drag cursor only shows when not disabled
- Shading store: Renamed `getMaterial` to `getMaterialCache` for clearer API semantics; added TypeScript generics to `updateMaterial` and `updateMaterialProperty` functions for improved type safety on material property updates

## [0.11.1] - 2026-03-30

### Fixed

- Import Scene: GLB file URIs now properly extracted from binary chunks instead of returning empty array

## [0.11.0] - 2026-03-30

### Added

- MxDialog: Added `icon` prop to display icon in dialog header
- Close icon: New close button SVG icon for dialog headers
- Import Scene Modal: New unified interface for importing 3D model files with support for:
  - Multi-format support: glTF/GLB, OBJ, and FBX files
  - Automatic format detection via magic bytes and content analysis
  - Asset management panel for textures, materials (.mtl), and binary (.bin) files
  - Auto-fill functionality to automatically match required assets by filename
  - Material settings panel for OBJ imports (side, wrapping, RGB normalization, transparency)
  - Proper blob URL cleanup with try-finally to prevent memory leaks
  - Error handling with toast notifications for failed imports
  - End-to-end tests for GLB, OBJ, and FBX file imports with asset management
  - Additional tests: modal close, multiple file upload, manual asset mapping
- Model format loaders: Added support for additional 3D model formats
  - GLTF/GLB loader with Draco, KTX2, and Meshopt compression support
  - MTL (Material Template Library) loader for associated materials
  - OBJ loader for legacy model support
  - FBX (Filmbox) loader for common 3D format support
  - All loaders include URL modifier support and proper error handling with toast notifications
- Input field tooltip indicators: Added question mark icon to labeled inputs with tooltips
- Tooltip layering: Added z-index to ensure tooltip content renders above other elements

### Changed

- MxDialog: Redesigned header with integrated close button for consistent modal styling
- Import Scene Modal: Renamed title from "Import Model" to "File Browser"
- Asset Browser modals: Unified titles to "Asset Browser" across Models and Texture libraries
- Render Image: Quality input changed from slider to number input for precision
- About Modal: Simplified branding from "Vue Mixeur" to "Mixeur"
- Dependency updates: Updated all dependencies to latest compatible versions
- MenuBar CSS refactoring: Moved menubar utility classes from `utils.css` to `components.css`, renamed classes for consistency (`.trigger` → `.menubar-trigger`, `.item` → `.menubar-item`), and replaced hardcoded colors with design token variables from the theme
- CSS improvements: Refactored button hover states to use more specific selectors (`not-disabled:hover`) instead of global `button:hover`
- Button variants: Added `.btn--highlight` variant with blue background for emphasized actions
- CSS cleanup: Removed unused tailwind-scrollbar plugin from main CSS
- InputSelect component refactored to use generics for improved type safety
- Simplified type annotations in camera-related components
- EXR loader refactored to move loader instantiation inside the function and added JSDoc documentation
- Removed manual icon chunking from Vite build configuration
- Self-hosted Inter font: Switched from external CDN (`rsms.me`) to local font files

### Fixed

- InputTexture memory leak: Added URL.revokeObjectURL() to release blob URL after texture loading
- InputSelect text overflow: Added truncate class to prevent long text from overflowing the select trigger

## [0.10.0] - 2026-03-22

### Added

- EXR texture support: Added ability to load EXR (OpenEXR) texture files in the texture input component
  - New `loadEXR` function in `src/three/modules/loaders/exr.ts`
  - Support for EXR files in both file dialog and texture library
  - Progress tracking for large EXR files
  - Proper error handling with toast notifications
  - Blob URL cleanup after loading

### Changed

- Improved texture management: Added proper texture disposal when replacing existing textures from the library
- Semantic naming: Renamed `removeMap` to `reset` for clearer function purpose

## [0.9.3] - 2026-03-19

### Fixed

- Correct bytesToSize handling of zero bytes

## [0.9.2] - 2026-03-18

### Fixed

- Use lightHasShadow type guard in component and dispose

## [0.9.1] - 2026-03-17

### Fixed

- PWA update notification and handling

## [0.9.0] - 2026-03-17

### Added

- Horizontal drag support to number input
- PWA support for offline capabilities

### Changed

- Replace usePointer with Pointer Lock API for better control handling
- Update dependencies to latest versions
- Extract lightHasShadow type guard and add RectAreaLight support
- Use useKeyModifier and dolly camera navigation
- Remove ts-ignore comments from store modules

### Fixed

- Transform controls initialized after event listeners

[Unreleased]: https://github.com/zabastx/mixeur/compare/v0.12.0...HEAD
[0.12.0]: https://github.com/zabastx/mixeur/compare/v0.11.2...v0.12.0
[0.11.2]: https://github.com/zabastx/mixeur/compare/v0.11.1...v0.11.2
[0.11.1]: https://github.com/zabastx/mixeur/compare/v0.11.0...v0.11.1
[0.11.0]: https://github.com/zabastx/mixeur/compare/v0.10.0...v0.11.0
[0.10.0]: https://github.com/zabastx/mixeur/compare/v0.9.3...v0.10.0
[0.9.3]: https://github.com/zabastx/mixeur/compare/v0.9.2...v0.9.3
[0.9.2]: https://github.com/zabastx/mixeur/compare/v0.9.1...v0.9.2
[0.9.1]: https://github.com/zabastx/mixeur/compare/v0.9.0...v0.9.1
[0.9.0]: https://github.com/zabastx/mixeur/compare/v0.8.0...v0.9.0
[0.8.0]: https://github.com/zabastx/mixeur/compare/v0.7.0...v0.8.0
[0.7.0]: https://github.com/zabastx/mixeur/compare/v0.6.0...v0.7.0
[0.6.0]: https://github.com/zabastx/mixeur/compare/v0.5.0...v0.6.0
[0.5.0]: https://github.com/zabastx/mixeur/compare/v0.1.0...v0.5.0
[0.1.0]: https://github.com/zabastx/mixeur/releases/tag/v0.1.0
