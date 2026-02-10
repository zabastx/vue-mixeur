import { render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'
import InputCheckbox from '@/components/input/InputCheckbox.vue'
import userEvent from '@testing-library/user-event'

describe('InputCheckbox', () => {
	it('renders unchecked', () => {
		const { getByRole, getByTestId } = render(InputCheckbox, {
			props: {
				modelValue: false
			}
		})

		getByRole('checkbox')

		expect(() => getByTestId('checkbox-indicator')).toThrow()
	})

	it('renders checked', () => {
		const { getByTestId } = render(InputCheckbox, {
			props: {
				modelValue: true
			}
		})

		getByTestId('checkbox-indicator')
	})

	it('emits update', async () => {
		const { getByRole, emitted } = render(InputCheckbox, {
			props: { modelValue: false }
		})

		const checkbox = getByRole('checkbox')

		expect(checkbox.getAttribute('data-state')).toBe('unchecked')

		await userEvent.click(checkbox)

		const updateValue = emitted<[boolean]>('update:modelValue')

		expect(updateValue).toHaveLength(1)

		expect(updateValue[0]?.[0]).toBe(true)
	})
})
