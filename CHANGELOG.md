# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

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

[Unreleased]: https://github.com/username/repo/compare/v0.10.0...HEAD
[0.9.3]: https://github.com/username/repo/compare/v0.9.2...v0.9.3
[0.9.2]: https://github.com/username/repo/compare/v0.9.1...v0.9.2
[0.9.1]: https://github.com/username/repo/compare/v0.9.0...v0.9.1
[0.9.0]: https://github.com/username/repo/compare/v0.8.0...v0.9.0
[0.8.0]: https://github.com/username/repo/compare/v0.7.0...v0.8.0
[0.7.0]: https://github.com/username/repo/compare/v0.6.0...v0.7.0
[0.6.0]: https://github.com/username/repo/compare/v0.5.0...v0.6.0
[0.5.0]: https://github.com/username/repo/compare/v0.1.0...v0.5.0
[0.1.0]: https://github.com/username/repo/releases/tag/v0.1.0
