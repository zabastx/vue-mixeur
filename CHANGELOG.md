# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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

[Unreleased]: https://github.com/username/repo/compare/v0.9.3...HEAD
[0.9.3]: https://github.com/username/repo/compare/v0.9.2...v0.9.3
[0.9.2]: https://github.com/username/repo/compare/v0.9.1...v0.9.2
[0.9.1]: https://github.com/username/repo/compare/v0.9.0...v0.9.1
[0.9.0]: https://github.com/username/repo/compare/v0.8.0...v0.9.0
[0.8.0]: https://github.com/username/repo/compare/v0.7.0...v0.8.0
[0.7.0]: https://github.com/username/repo/compare/v0.6.0...v0.7.0
[0.6.0]: https://github.com/username/repo/compare/v0.5.0...v0.6.0
[0.5.0]: https://github.com/username/repo/compare/v0.1.0...v0.5.0
[0.1.0]: https://github.com/username/repo/releases/tag/v0.1.0
