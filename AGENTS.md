# AGENTS.md

Guidelines for agentic coding agents working in this Vue Mixeur repository.

**Package Manager**: `bun` (not npm/pnpm/yarn)

- **DO NOT start dev server unless explicitly requested** - assume user is already running it

### Three.js Integration

- Import from `@/three` wrapper (includes BVH acceleration)
- Use `shallowRef` for Three.js objects
- Always dispose objects when no longer needed:
  - Call `dispose()` on geometries, materials, textures
  - Use `disposeModel()` helper from `@/three/modules/core/dispose`

### Error Handling

- Use try-catch for async operations
- Use toast system for user feedback (`useToast` composable):
  - `toast.info()`, `toast.success()`, `toast.warning()`, `toast.error()`

### File Naming

- camelCase for ts files: `useToast.ts`, `modelLoader.ts`
- PascalCase for vue components: `InputNumber.vue`
- Keep related files in organized directories

## Component Patterns

- Use Reka UI components as base for form inputs
- Use `useModals` composable for dialogs
- Follow Blender-inspired UI patterns

## Development Tips

- Pre-commit hooks run ESLint and Prettier automatically

## Clarification and Correction Rules

- If the user's instructions contain contradictions, factual errors, or impossible steps, the agent should point them out and propose corrections.
- If essential details are missing, the agent must ask clarifying questions.
- If non-essential details are missing, the agent should infer reasonable defaults and proceed.
