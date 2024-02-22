import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import Lookup, { ADD, IP_LOOKUP_BODY, IP_LOOKUP_TITLE } from '../ip.lookup.component'

describe('Lookup Component', () => {
    it('renders correctly', () => {
        render(<Lookup />)

        expect(screen.getByText(IP_LOOKUP_TITLE)).toBeInTheDocument()
        expect(screen.getByText(IP_LOOKUP_BODY)).toBeInTheDocument()
        expect(screen.getByRole('button', { name: ADD })).toBeInTheDocument()
        // on load there should be one IPInput
        expect(screen.getAllByRole('textbox').length).toBe(1)
    })

    it('adds a new IPInput on "Add" button click', async () => {
        render(<Lookup />)
        const addButton = screen.getByRole('button', { name: ADD })

        // on load there should be one IPInput
        expect(screen.getAllByRole('textbox').length).toBe(1)

        await userEvent.click(addButton)

        // after click there should be 2 input rows
        expect(screen.getAllByRole('textbox').length).toBe(2)
    })
})