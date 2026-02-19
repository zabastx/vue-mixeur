# AGENTS.md

Guidelines for agentic coding agents working in this Vue Mixeur repository.

## Development Commands

**Package Manager**: `bun` (not npm/pnpm/yarn)

### Build & Development

- **DO NOT start dev server unless explicitly requested** - assume user is already running it
- `bun run dev` - Start dev server on port 5173
- `bun run build` - Build for production
- `bun run preview` - Preview production build on port 4173

### Code Quality

- `bun run type-check` - Run TypeScript type checking with vue-tsc
- `bun run lint` - Run ESLint on all files
- `bun run lint:fix` - Run ESLint with auto-fix
- `bun run format` - Format code with Prettier

### Testing

**Unit Tests (Vitest)**:

- `bun run test` - Run tests in watch mode
- `bun run test:unit` - Run tests once
- `bun run test -- InputNumber` - Run a single test file (partial match)
- `bun run test -- --reporter=verbose` - Run with verbose output

**E2E Tests (Playwright)**:

- `bun run test:e2e` - Run all E2E tests
- `bun run test:e2e:ui` - Run with UI mode
- `bun run test:e2e:debug` - Run in debug mode

## Code Style Guidelines

### TypeScript & Vue

- Use Vue 3 Composition API with `<script setup lang="ts">`
- Strict TypeScript - all types must be defined
- Use `defineProps`, `defineEmits`, and `defineModel` for component APIs
- Prefer `ref` over `reactive` for primitives
- Use `shallowRef` for large Three.js objects
- Use `useTemplateRef` instead of `ref` for template refs

### Import Organization

```typescript
// 1. Node.js built-ins
import { fileURLToPath } from 'node:url'

// 2. External dependencies
import { ref } from 'vue'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'

// 3. Internal imports (use @ alias)
import { useThreeStore } from '@/store/three'
import { setGridHelper } from '@/three/modules/helpers/grid'
```

### Component Structure

- PascalCase for component names (e.g., `MxViewport`, `InputNumber`)
- Components are auto-imported via `unplugin-vue-components` (see `src/components.d.ts`)
- Reka UI components are auto-imported (NumberFieldRoot, CheckboxRoot, etc.)
- Use scoped styles with Tailwind classes
- Add `data-testid` attributes for test selection

```vue
<template>
  <div class="flex items-center">
    <NumberFieldInput data-testid="number-input" />
  </div>
</template>

<script lang="ts" setup>
import type { NumberFieldRootProps } from 'reka-ui'

const props = withDefaults(defineProps<NumberFieldRootProps>(), {
  formatOptions: () => ({ minimumFractionDigits: 3 })
})
const model = defineModel<number>({ default: 0 })
</script>
```

### Formatting (Prettier)

Config in `.prettierrc.json`:

- `singleQuote: true`, `semi: false`, `tabWidth: 2`
- `trailingComma: "none"`, `useTabs: true`
- `printWidth: 100`
- Plugins: `prettier-plugin-tailwindcss`, `prettier-plugin-classnames`

### ESLint Rules

- Uses `@eslint/js`, `typescript-eslint`, `eslint-plugin-vue`
- Vue and TypeScript recommended rules enabled
- Prettier integration for formatting

### State Management (Pinia)

Use composition API style stores with HMR:

```typescript
export const useProgressStore = defineStore('progress', () => {
	const loadingItems = ref<LoadingProgress[]>([])

	function startLoading(id: string, filename: string, total: number) {
		// implementation
	}

	return { loadingItems, startLoading }
})

if (import.meta.hot) {
	import.meta.hot.accept(acceptHMRUpdate(useProgressStore, import.meta.hot))
}
```

### Three.js Integration

- Import from `@/three` wrapper (includes BVH acceleration)
- Use `shallowRef` for Three.js objects
- Always dispose objects when no longer needed:
  - Call `dispose()` on geometries, materials, textures
  - Use `disposeModel()` helper from `@/three/modules/core/dispose`

### Styling

- Tailwind CSS v4 with `@import 'tailwindcss'`
- Theme variables in `src/assets/css/theme/`
- Use semantic class names (e.g., `bg-editor-border`, `text-gray-200`)
- Custom CSS properties for UI colors in `@theme` blocks

### Error Handling

- Use try-catch for async operations
- Use toast system for user feedback (`useToast` composable):
  - `toast.info()`, `toast.success()`, `toast.warning()`, `toast.error()`

### File Naming

- camelCase for ts files: `useToast.ts`, `modelLoader.ts`
- PascalCase for vue components: `InputNumber.vue`
- Keep related files in organized directories

### Testing Patterns

- Use `@testing-library/vue` for component tests
- Use `@testing-library/user-event` for interactions
- Mock Three.js and stores in `tests/setup.ts`
- Environment: `happy-dom`

```typescript
import { render, screen } from '@testing-library/vue'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'

describe('InputNumber', () => {
	it('renders with default value', () => {
		render(InputNumber, { props: { modelValue: 42 } })
		expect(screen.getByTestId<HTMLInputElement>('number-input').value).toBe('42.000')
	})
})
```

## Architecture Notes

### Core Directories

- `src/components/` - Vue components organized by domain
- `src/store/` - Pinia stores
- `src/three/` - Three.js setup and utilities
- `src/composables/` - Reusable Vue composition functions
- `src/utils/` - General utility functions

### Three.js Structure

- `src/three/index.ts` - Main wrapper with BVH acceleration
- `src/three/modules/core/` - Core utilities (raycaster, disposal)
- `src/three/modules/loaders/` - Model and asset loading
- `src/three/modules/helpers/` - Three.js helper objects
- `src/three/modules/controls/` - Camera and transform controls

### Component Patterns

- Use Reka UI components as base for form inputs
- Use `useModals` composable for dialogs
- Follow Blender-inspired UI patterns

## Development Tips

- Always run `bun run type-check` before committing
- Use the existing toast system for notifications (`useToast`)
- Use the `@` alias for all internal imports
- Pre-commit hooks run ESLint and Prettier automatically

## Clarification and Correction Rules

- If the user's instructions contain contradictions, factual errors, or impossible steps, the agent should point them out and propose corrections.
- If essential details are missing, the agent must ask clarifying questions.
- If non-essential details are missing, the agent should infer reasonable defaults and proceed.
