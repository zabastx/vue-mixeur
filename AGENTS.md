# AGENTS.md

**Package Manager**: `bun` (not npm/pnpm/yarn)

- **DO NOT start dev server unless explicitly requested** - assume user is already running it

### Three.js Integration

- Import from `@/three` wrapper (includes BVH acceleration)
- Use `shallowRef` for Three.js objects

## Clarification and Correction Rules

- If the user's instructions contain contradictions, factual errors, or impossible steps, the agent should point them out and propose corrections.
- If essential details are missing, the agent must ask clarifying questions.
- If non-essential details are missing, the agent should infer reasonable defaults and proceed.
