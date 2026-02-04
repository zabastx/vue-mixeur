# AGENTS.md

This file contains guidelines and commands for agentic coding agents working in this Vue Mixeur repository.

## Development Commands

**Package Manager**: This project uses `bun` (not npm/pnpm/yarn)

### Build & Development

- **DO NOT start dev server unless explicitly requested** - assume user is already running it
- `bun run dev` - Start dev server on port 5173
- `bun run build` - Build for production (runs type-check + build-only)
- `bun run build-only` - Build without type checking
- `bun run preview` - Preview production build locally on port 4173

### Code Quality

- `bun run type-check` - Run TypeScript type checking with vue-tsc
- `bun run lint` - Run ESLint on all files
- `bun run lint:fix` - Run ESLint with auto-fix
- `bun run format` - Format code with Prettier

### Testing

This project uses Vitest for unit testing and Playwright for E2E testing.

**Unit Tests (Vitest)**:

- `bun run test` - Run tests in watch mode
- `bun run test:unit` - Run tests once
- `bun run test -- InputNumber` - Run a single test file (partial match)
- `bun run test -- --reporter=verbose` - Run with verbose output

**E2E Tests (Playwright)**:

- `bun run test:e2e` - Run all E2E tests
- `bun run test:e2e:ui` - Run with UI mode
- `bun run test:e2e:debug` - Run in debug mode

**Test Configuration**:

- Unit tests use `happy-dom` environment for DOM simulation
- Test setup file: `tests/setup.ts`
- Unit tests located in: `tests/unit/`
- E2E tests located in: `tests/e2e/`
- Coverage reports generated in `coverage/` directory

## Code Style Guidelines

### TypeScript & Vue

- Use Vue 3 Composition API with `<script setup lang="ts">`
- Strict TypeScript configuration - all types must be defined
- Use `defineProps`, `defineEmits`, and `defineModel` for component APIs
- Prefer `ref` over `reactive` for primitive values
- Use `shallowRef` for large Three.js objects to avoid reactivity overhead
- Use `useTemplateRef` instead of `ref` for template references

### Import Organization

```typescript
// 1. Node.js built-ins
import { fileURLToPath, URL } from 'node:url'

// 2. External dependencies (Vue, Three.js, etc.)
import { createApp } from 'vue'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'

// 3. Internal imports (use @ alias)
import { useThreeStore } from '@/store/three'
import { setGridHelper } from '@/three/modules/helpers/grid'
```

### Component Structure

- Use PascalCase for component names (e.g., `MViewport`, `InputNumber`)
- Prefix components with their domain: `M` for main components, `Input` for form inputs
- Keep components focused - split complex components into smaller ones
- Use scoped styles with Tailwind classes

### Formatting (Prettier)

- Single quotes, no semicolons
- Tabs with width of 2
- No trailing commas
- Print width: 100
- Plugins: `prettier-plugin-tailwindcss`, `prettier-plugin-classnames`

### ESLint Rules

- Uses `@eslint/js`, `typescript-eslint`, and `eslint-plugin-vue`
- Vue recommended rules enabled
- TypeScript recommended rules enabled
- Prettier integration for formatting

### State Management

- Use Pinia stores for shared state
- Store files in `src/store/` with descriptive names
- Use composition API style stores (defineStore with arrow function)
- Implement proper disposal for Three.js objects

### Three.js Integration

- Import Three.js from `@/three` wrapper (includes BVH acceleration)
- Use `shallowRef` for Three.js objects to prevent unnecessary reactivity
- Always dispose of Three.js objects when no longer needed:
  - Call `dispose()` on geometries, materials, textures
  - Remove from scene with `scene.remove(object)`
  - Use `disposeModel()` helper from `@/three/modules/core/dispose`
- Use the modular structure in `src/three/modules/`
- Follow the existing patterns for scene management, controls, and rendering

### Styling

- Use Tailwind CSS v4 for all styling (imported via `@import 'tailwindcss'`)
- Follow the existing color scheme with CSS custom properties (see `src/assets/css/theme/`)
- Use semantic class names (e.g., `bg-editor-border`, `text-gray-200`)
- Keep component styles scoped when possible
- Use CSS Grid and Flexbox for layouts

### Error Handling

- Use try-catch blocks for async operations
- Implement proper error boundaries for Three.js operations
- Use the toast system for user feedback (`useToast` composable):
  - `toast.info(message)`, `toast.success(message)`, `toast.warning(message)`, `toast.error(message)`
- Check WebGL compatibility before initializing Three.js

### File Naming

- Use camelCase for ts files: `modelLoader.ts`, `useToast.ts`
- Use PascalCase for vue components: `ViewportHeader.vue`, `InputNumber.vue`
- Use PascalCase for component exports
- Use descriptive names that reflect functionality
- Keep related files in organized directories

### Performance

- Use `useTemplateRef` instead of `ref` for template references
- Implement proper cleanup in `onUnmounted` lifecycle
- Use computed properties for expensive calculations
- Lazy load heavy Three.js modules when possible (dynamic imports)

### Git Hooks

- This project uses Husky with lint-staged
- Pre-commit hooks run ESLint and Prettier automatically
- All staged files are formatted before commit

## Architecture Notes

### Core Directories

- `src/components/` - Vue components organized by domain
- `src/store/` - Pinia stores for state management
- `src/three/` - Three.js setup and utilities
- `src/composables/` - Reusable Vue composition functions
- `src/utils/` - General utility functions

### Three.js Structure

- `src/three/modules/` - Modular Three.js functionality
- `src/three/modules/core/` - Core utilities (raycaster, disposal)
- `src/three/modules/loaders/` - Model and asset loading
- `src/three/modules/helpers/` - Three.js helper objects
- `src/three/modules/controls/` - Camera and transform controls
- `src/three/modules/camera/` - Camera setup and management

### Component Patterns

- Use Reka UI components as base for form inputs (NumberField, Checkbox, etc.)
- Implement proper TypeScript interfaces for props
- Use the existing modal system for dialogs (`useModals` composable)
- Follow the established pattern for viewport components

### Testing Patterns

- Use `@testing-library/vue` for component tests
- Use `@testing-library/user-event` for user interactions
- Mock Three.js and stores in `tests/setup.ts`
- Store tests: `tests/unit/store/`
- Component tests: `tests/unit/components/`
- Composable tests: `tests/unit/composables/`

## Development Tips

- Always run `bun run type-check` before committing
- Use the existing toast system for user notifications (`useToast` composable)
- Follow Blender-inspired UI patterns for consistency
- Test Three.js functionality in different browsers
- Check WebGL compatibility before scene initialization
- Use the `@` alias for all internal imports
