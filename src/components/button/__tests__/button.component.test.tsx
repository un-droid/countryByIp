import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import Button from '../button.component'

const BTN_TXT = 'just a button'

describe('Button Component', () => {
    it('renders correctly', () => {
        render(<Button>{BTN_TXT}</Button>)

        expect(screen.getByRole('button', { name: BTN_TXT })).toBeInTheDocument()
    })

    it('applies the variant class correctly', () => {
        render(<Button variant="secondary">{BTN_TXT}</Button>)

        const button = screen.getByRole('button', { name: BTN_TXT })
        expect(button).toHaveClass('button-secondary')
    })
})