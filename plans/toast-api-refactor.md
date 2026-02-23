# Toast API Refactor Plan

## Overview

Refactor `useToast.ts` to use a single unified method instead of multiple type-specific methods (`.info()`, `.error()`, etc.).

## Current State

### ToastOptions Interface

Located in [`MxToast.vue`](src/components/utils/MxToast.vue:42):

```ts
interface ToastOptions {
	id?: string
	title?: string
	message: string
	type?: 'info' | 'success' | 'warning' | 'error'
	duration?: number
}
```

### Current API

```ts
const { toast } = useToast()

// Multiple methods for different types
toast.info(message, options?)
toast.success(message, options?)
toast.warning(message, options?)
toast.error(message, options?)

// Utility methods
toast.remove(id)
toast.clear()
```

### Current Usages

| File                                                                           | Current Usage                                      |
| ------------------------------------------------------------------------------ | -------------------------------------------------- |
| [`ColorPicker.vue`](src/components/utils/ColorPicker/ColorPicker.vue:59)       | `toast.error(err.message)`                         |
| [`ModalRenderImage.vue`](src/components/render-image/ModalRenderImage.vue:251) | `toast.error('', { title: 'Image render error' })` |
| [`TopBar.vue`](src/components/header/TopBar.vue:159)                           | `toast.error(\`Failed to import ${format} file\`)` |

## Proposed Changes

### New API Design

```ts
const { toast } = useToast()

// Single method with all options - supports stacking multiple toasts
toast.add({
  type: 'info' | 'success' | 'warning' | 'error',
  message: string,
  title?: string,
  duration?: number,
  id?: string
})

// Utility methods remain unchanged
toast.remove(id)
toast.clear()
```

### Stacking Support

The stacking functionality already exists in `MxToast.vue`:

- `toasts` is an array that holds multiple toast instances
- `ToastViewport` uses flexbox with gap for stacking
- Each call to `addToast()` pushes a new toast to the array
- Multiple toasts can be displayed simultaneously

### Example Usage

```ts
// Before
toast.error('Something went wrong')
toast.info('File saved', { title: 'Success' })

// After
toast.add({ type: 'error', message: 'Something went wrong' })
toast.add({ type: 'info', message: 'File saved', title: 'Success' })

// Stacking example - both toasts will appear
toast.add({ type: 'info', message: 'Processing file...' })
toast.add({ type: 'success', message: 'File uploaded!' })
```

## Implementation Steps

### 1. Update useToast.ts

Replace the `toast` object with a single `add()` method:

```ts
const toast = {
	add: (options: ToastOptions) => {
		if (!toastInstance.value) {
			console.warn('Toast instance not initialized')
			return
		}
		return toastInstance.value.addToast(options)
	},

	remove: (id: string) => {
		if (!toastInstance.value) {
			console.warn('Toast instance not initialized')
			return
		}
		toastInstance.value.removeToast(id)
	},

	clear: () => {
		if (!toastInstance.value) {
			console.warn('Toast instance not initialized')
			return
		}
		toastInstance.value.clearAllToasts()
	}
}
```

### 2. Update Component Usages

#### ColorPicker.vue (line 59)

```ts
// Before
toast.error(err.message)

// After
toast.add({ type: 'error', message: err.message })
```

#### ModalRenderImage.vue (line 251)

```ts
// Before
toast.error('', { title: 'Image render error' })

// After
toast.add({ type: 'error', message: '', title: 'Image render error' })
```

#### TopBar.vue (line 159)

```ts
// Before
toast.error(`Failed to import ${format} file`)

// After
toast.add({ type: 'error', message: `Failed to import ${format} file` })
```

## Benefits

- **Consistent API**: Single entry point for all toast notifications
- **Explicit options**: All parameters are named, improving readability
- **Easier to extend**: New options can be added without creating new methods
- **Better TypeScript support**: Single typed interface for all use cases
