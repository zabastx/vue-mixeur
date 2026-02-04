# AGENTS.md

This file contains guidelines and commands for agentic coding agents working in this Vue Mixeur repository.

## Development Commands

### Build & Development

- **DO NOT start dev server unless explicitly requested** - assume user is already running it
- `bun run build` - Build for production (runs type-check + build-only)
- `bun run build-only` - Build without type checking
- `bun run preview` - Preview production build locally
- Dev server runs on default Vite port (usually 5173)

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

**E2E Tests (Playwright)**:

- `bun run test:e2e` - Run all E2E tests
- `bun run test:e2e:ui` - Run with UI mode
- `bun run test:e2e:debug` - Run in debug mode

**Test Configuration**:

- Unit tests use `happy-dom` environment for DOM simulation
- Test setup file: [`src/test/setup.ts`](src/test/setup.ts)
- E2E tests located in [`e2e/`](e2e/) directory
- Coverage reports generated in `coverage/` directory

**Current Test Coverage**:

- Store tests: [`src/store/__tests__/`](src/store/__tests__/)
- Component tests: [`src/components/**/__tests__/`](src/components/)
- Composable tests: [`src/composables/__tests__/`](src/composables/__tests__/)
- E2E tests: [`e2e/`](e2e/)

## Code Style Guidelines

### TypeScript & Vue

- Use Vue 3 Composition API with `<script setup lang="ts">`
- Strict TypeScript configuration - all types must be defined
- Use `defineProps`, `defineEmits`, and `defineModel` for component APIs
- Prefer `ref` over `reactive` for primitive values
- Use `shallowRef` for large Three.js objects to avoid reactivity overhead

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

### State Management

- Use Pinia stores for shared state
- Store files in `src/store/` with descriptive names
- Use composition API style stores (defineStore with arrow function)
- Implement proper disposal for Three.js objects

### Three.js Integration

- Import Three.js from `@/three` wrapper (includes BVH acceleration)
- Use `shallowRef` for Three.js objects to prevent unnecessary reactivity
- Always dispose of Three.js objects when no longer needed
- Use the modular structure in `src/three/modules/`
- Follow the existing patterns for scene management, controls, and rendering

### Styling

- Use Tailwind CSS for all styling
- Follow the existing color scheme with CSS custom properties
- Use semantic class names (e.g., `bg-editor-border`, `text-gray-200`)
- Keep component styles scoped when possible
- Use CSS Grid and Flexbox for layouts

### Error Handling

- Use try-catch blocks for async operations
- Implement proper error boundaries for Three.js operations
- Use the toast system for user feedback (`useToast` composable)
- Check WebGL compatibility before initializing Three.js

### File Naming

- Use camelCase for ts files: `modelLoader.ts`
- Use PascalCase for vue components: `ViewportHeader.vue`
- Use PascalCase for component exports
- Use descriptive names that reflect functionality
- Keep related files in organized directories

### Performance

- Use `useTemplateRef` instead of `ref` for template references
- Implement proper cleanup in `onUnmounted` lifecycle
- Use computed properties for expensive calculations
- Lazy load heavy Three.js modules when possible

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

### Three.js Structure

- `src/three/modules/` - Modular Three.js functionality
- `src/three/modules/core/` - Core utilities (raycaster, disposal)
- `src/three/modules/loaders/` - Model and asset loading
- `src/three/modules/helpers/` - Three.js helper objects

### Component Patterns

- Use Reka UI components as base for form inputs
- Implement proper TypeScript interfaces for props
- Use the existing modal system for dialogs
- Follow the established pattern for viewport components

## Development Tips

- Always run `bun run type-check` before committing
- Use the existing toast system for user notifications
- Follow Blender-inspired UI patterns for consistency
- Test Three.js functionality in different browsers
- Check WebGL compatibility before scene initialization
