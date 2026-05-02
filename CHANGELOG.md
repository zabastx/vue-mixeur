# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Changed

- Refactored store architecture: Split monolithic `three.ts` into focused stores
  - Extracted `input.ts` for keyboard, pointer, and wheel event handling
  - Simplified `app.ts` to only contain UI visibility state
  - Extracted `scene.ts` for object lifecycle (add/delete/clone), groups, and export
  - `three.ts` now only handles selection and render orchestration
  - Moved keybindings to `config/keymaps.ts` for better maintainability

### Fixed

- Fixed enabling shadow in a light that does not support it
- Viewport Widget: fixed toggle camera view icon
- Fixed visibility properties toggle

## [0.21.0] - 2026-04-28

### Added

- Transform controls: Axis constraint hotkeys (X, Y, Z, C) for restricting movement to specific axes
- Transform controls: Escape key to cancel drag operation and restore previous transform state
- Transform controls: `isTransformDrag` state for tracking active transform operations
- KeymapInformation: Context-sensitive keyboard hints displayed during transform operations

### Changed

- Hotkey handling: Refactored keyboard event registration from centralized `app.ts` store to dedicated `camera.ts` and `controls.ts` stores
- App store: Renamed `useHotKeys()` to `initListeners()` for clarity
- App store: Removed unused camera and transform mode hotkey handlers (moved to dedicated stores)
- Controls store: Split `setupControls()` into `initControls()`, `setOrbitControls()`, and `setTransformControls()` functions
- Input ignored elements: Added check for input/textarea/select to prevent hotkey conflicts
- KeymapInformation: Icon and text styling adjustments for better layout

### Fixed

- Material Preview settings: fixed broken thumbnail url
