import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import IPInput from '../ip.input.component'
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
const onRemoveRowMock = jest.fn()


describe('IPInput Component', () => {
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
        render(<IPInput index={1} placeholder="Enter an IP" onRemoveRow={onRemoveRowMock} isLastInput={false} />)

        const inputField = screen.getByPlaceholderText('Enter an IP')
        const indexLabel = screen.getByText('1')
        expect(inputField).toBeDefined()
        expect(indexLabel).toBeDefined()
    })

    it('should allow valid ip input', async () => {
        render(<IPInput index={1} onRemoveRow={onRemoveRowMock} isLastInput={false} />)
        const inputField = screen.getByRole('textbox')

        await userEvent.type(inputField, '127.0.0.1')
        expect(inputField).toHaveValue('127.0.0.1')
    })

    it('should prevent invalid characters', async () => {
        render(<IPInput index={1} onRemoveRow={onRemoveRowMock} isLastInput={false} />)
        const inputField = screen.getByRole('textbox')

        await userEvent.type(inputField, 'abcd')
        expect(inputField).toHaveValue('')
    })

    it('calls fetchCountryData on form submission with valid input', async () => {
        render(<IPInput index={1} onRemoveRow={onRemoveRowMock} isLastInput={false} />)
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

        render(<IPInput index={1} onRemoveRow={onRemoveRowMock} isLastInput={false} />)
        const inputField = screen.getByRole('textbox')
        await waitFor(() => expect(inputField).toBeDisabled())
    })

    it('does not disable input when loading is false', async () => {
        render(<IPInput index={1} onRemoveRow={onRemoveRowMock} isLastInput={false} />)
        const inputField = screen.getByRole('textbox')
        await waitFor(() => expect(inputField).not.toBeDisabled())
    })

    it('calls fetchCountryData with empty string and touchedForm = false', async () => {
        render(<IPInput index={1} onRemoveRow={onRemoveRowMock} isLastInput={false} />)

        const inputField = screen.getByRole('textbox')

        inputField.focus()
        inputField.blur()

        await waitFor(() => {
            expect(fetchCountryDataMock).toHaveBeenCalledWith('', false)
        })
    })
})

describe('IPInput - remove row', () => {
    test('calls onRemoveRow with the correct index when remove icon is clicked and not last row (isLastInput=false)', async () => {
        const onRemoveRowMock = jest.fn()
        const index = 2

        render(<IPInput index={index} onRemoveRow={onRemoveRowMock} isLastInput={false} />)

        // grab the label by getByTestId
        fireEvent.mouseEnter(screen.getByTestId(`remove-row-${index}`))
        await userEvent.click(screen.getByTestId(`remove-row-${index}`))

        // manually trigger the onAnimationEnd event to simulate the end of the animation
        fireEvent.animationEnd(screen.getByTestId(`remove-row-${index}`))

        // waitFor to allow any state updates to complete
        await waitFor(() => {
            expect(onRemoveRowMock).toHaveBeenCalledWith(index)
        })
    })

    test('does not call onRemoveRow when isLastInput is true', async () => {
        const onRemoveRowMock = jest.fn()
        const index = 1

        render(<IPInput index={index} onRemoveRow={onRemoveRowMock} isLastInput={true} />)

        // try to click the label, expecting no removal to occur
        await userEvent.click(screen.getByText(index.toString()))

        // verify onRemoveRowMock was not called
        expect(onRemoveRowMock).not.toHaveBeenCalled()
    })
})