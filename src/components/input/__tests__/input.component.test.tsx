import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import InputRow from '../input.component'
import useCountryByIp from '../../../hooks/useCountryByIp'

const fetchCountryDataMock = jest.fn()

jest.mock('../../../hooks/useCountryByIp', () => {
    return {
        __esModule: true,
        default: jest.fn(() => ({
            loading: false,
            reqStatus: null,
            fetchCountryData: fetchCountryDataMock,
        })),
    }
})


describe('InputRow Component', () => {
    beforeEach(() => {
        // reset mock implementations and states before each test
        jest.mocked(useCountryByIp).mockImplementation(() => ({
            loading: false,
            reqStatus: null,
            fetchCountryData: fetchCountryDataMock,
        }))
        fetchCountryDataMock.mockClear()
    })

    it('should render with an input field and index label', () => {
        render(<InputRow index={1} placeholder="Enter an IP" />)

        const inputField = screen.getByPlaceholderText('Enter an IP')
        const indexLabel = screen.getByText('1')
        expect(inputField).toBeDefined()
        expect(indexLabel).toBeDefined()
    })

    it('should allow valid ip input', async () => {
        render(<InputRow index={1} />)
        const inputField = screen.getByRole('textbox')

        await userEvent.type(inputField, '127.0.0.1')
        expect(inputField).toHaveValue('127.0.0.1')
    })

    it('should prevent invalid characters', async () => {
        render(<InputRow index={1} />)
        const inputField = screen.getByRole('textbox')

        await userEvent.type(inputField, 'abcd')
        expect(inputField).toHaveValue('')
    })

    it('calls fetchCountryData on form submission with valid input', async () => {
        render(<InputRow index={1} />)
        const inputField = screen.getByRole('textbox')

        await userEvent.type(inputField, '127.0.0.1')
        await userEvent.keyboard('{Enter}')

        await waitFor(() => {
            // called with a valid ip and formTouched boolean as true
            expect(fetchCountryDataMock).toHaveBeenCalledWith('127.0.0.1', true)
        })
    })

    it('disables input when loading is true', async () => {
        // adjust mock implementation for this specific test
        jest.mocked(useCountryByIp).mockImplementation(() => ({
            loading: true,
            reqStatus: null,
            fetchCountryData: fetchCountryDataMock,
        }))

        render(<InputRow index={1} />)
        const inputField = screen.getByRole('textbox')
        await waitFor(() => expect(inputField).toBeDisabled())
    })

    it('does not disable input when loading is false', async () => {
        render(<InputRow index={1} />)
        const inputField = screen.getByRole('textbox')
        await waitFor(() => expect(inputField).not.toBeDisabled())
    })

    it('calls fetchCountryData with empty string and touchedForm = false', async () => {
        render(<InputRow index={1} />)

        const inputField = screen.getByRole('textbox')

        inputField.focus()
        inputField.blur()

        await waitFor(() => {
            expect(fetchCountryDataMock).toHaveBeenCalledWith('', false)
        })
    })
})