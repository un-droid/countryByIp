import { act, render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import * as utils from '../../../utils'
import Time from '../time.component'

const unixTime = 1708354201.463
const futureUnixTime = 2145916800 // some future date
const timeZone = 'America/New_York'

jest.spyOn(utils, 'getLocalTime').mockImplementation((unixTime, timeZone = 'UTC') => {
    if (unixTime <= 0) {
        return "00:00:00"
    }
    return new Date(unixTime).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
        timeZone: timeZone
    })
})

describe('Time component', () => {
    it('displays the time correctly formatted', () => {
        render(<Time currentUnixTime={unixTime} timeZone={timeZone} />)
        expect(utils.getLocalTime).toHaveBeenCalledWith(unixTime * 1000, timeZone)
        expect(screen.getByText(/:/)).toBeInTheDocument()
    })

    it('handles falsy (0) currentUnixTime by displaying default time', () => {
        render(<Time currentUnixTime={0} />)
        expect(screen.getByText('00:00:00')).toBeInTheDocument()
    })

    it('handles falsy negative value (-1) for currentUnixTime by displaying default time', () => {
        render(<Time currentUnixTime={-1} />)
        expect(screen.getByText('00:00:00')).toBeInTheDocument()
    })

    it('handles udefined for currentUnixTime by displaying default time', () => {
        render(<Time currentUnixTime={undefined as unknown as number} />)
        expect(screen.getByText('00:00:00')).toBeInTheDocument()
    })

    it('updates displayed time correctly', async() => {
        jest.useFakeTimers()
        const expectedTimeAfter1Second = new Date((unixTime + 1) * 1000).toLocaleTimeString('en-US', {
            timeZone: 'UTC',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false,
        })

        render(<Time currentUnixTime={unixTime}/>)
        await act(async () => jest.advanceTimersByTime(1000))

        expect(screen.getByText(expectedTimeAfter1Second)).toBeInTheDocument()
        jest.useRealTimers()
    })

    it('correctly handles future Unix times', () => {
        const expectedFutureTime = new Date(futureUnixTime * 1000).toLocaleTimeString('en-US', {
            timeZone: 'UTC',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false,
        })

        render(<Time currentUnixTime={futureUnixTime} />)
        expect(screen.getByText(expectedFutureTime)).toBeInTheDocument()
    })

    it('cleans up interval on unmount to prevent memory leaks', () => {
        const clearIntervalSpy = jest.spyOn(window, 'clearInterval')
        const { unmount } = render(<Time currentUnixTime={unixTime} />)
        unmount()

        expect(clearIntervalSpy).toHaveBeenCalled()
        clearIntervalSpy.mockRestore() // clean up the spy
    })
})