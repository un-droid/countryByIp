import { act, renderHook, waitFor } from '@testing-library/react'
import useCountryByIp, { initialData, INVALID_IP_MSG } from '../useCountryByIp'
import { Status } from '../../types'
import fetchMock from 'jest-fetch-mock'

fetchMock.enableMocks()

const mockResponse = {
    ip: "23.46.202.144",
    continent_code: "NA",
    continent_name: "North America",
    country_code2: "US",
    country_code3: "USA",
    country_name: "United States",
    country_name_official: "United States of America",
    country_capital: "Washington, D.C.",
    state_prov: "Georgia",
    state_code: "US-GA",
    district: "",
    city: "Atlanta",
    zipcode: "30303",
    latitude: "33.74831",
    longitude: "-84.39111",
    is_eu: false,
    calling_code: "+1",
    country_tld: ".us",
    languages: "en-US,es-US,haw,fr",
    country_flag: "https://ipgeolocation.io/static/flags/us_64.png",
    geoname_id: "4227123",
    isp: "Akamai Technologies, Inc.",
    connection_type: "",
    organization: "Akamai Technologies, Inc.",
    currency: {
        code: "USD",
        name: "US Dollar",
        symbol: "$",
    },
    time_zone: {
        name: "America/New_York",
        offset: -5,
        offset_with_dst: -5,
        current_time: "2024-02-19 09:50:01.463-0500",
        current_time_unix: 1708354201.463,
        is_dst: false,
        dst_savings: 0,
    },
}

const mockExtractedData = {
    countryFlag: 'https://ipgeolocation.io/static/flags/us_64.png',
    countryName: 'United States',
    localTime: '18:32:34',
    unixTime: 1708354201.463,
    timeZone: 'America/New_York'
}

const NETWORK_ERR = 'Network Error'
const ERR_FETCHING = 'Error fetching data'
const VALID_IP = '1.1.1.1'
const INVALID_IP = '1..11.1.1'

describe('useCountryByIp hook', () => {
    afterEach(() => {
        fetchMock.resetMocks()
    })

    it('should start with initial state', async () => {
        const { result } = renderHook(() => useCountryByIp())

        expect(result.current.loading).toBe(false)
        expect(result.current.reqStatus).toEqual({ status: Status.Idle, data: initialData })
    })

    it('sets loading state correctly during fetch', async () => {
        const { result } = renderHook(() => useCountryByIp())

        act(() => {
            result.current.fetchCountryData(VALID_IP, true)
        })

        expect(result.current.loading).toBe(true)

        await waitFor(() => {
            expect(result.current.loading).toBe(false)
        })
    })

    it('handles invalid IP addresses correctly', async () => {
        const { result } = renderHook(() => useCountryByIp())

        act(() => {
            result.current.fetchCountryData(INVALID_IP, true)
        })

        expect(result.current.reqStatus).toEqual({ data: null, status: Status.Warning, message: INVALID_IP_MSG })
    })

    it('handles successful API response', async () => {
        fetchMock.mockResponseOnce(JSON.stringify(mockResponse))

        const { result } = renderHook(() => useCountryByIp())
        act(() => {
            result.current.fetchCountryData(VALID_IP, true)
        })

        await waitFor(() => {
            expect(result.current.loading).toBe(false)
            expect(result.current.reqStatus!.status).toBe(Status.Success)
            expect(result.current.reqStatus!.data).toEqual(mockExtractedData)
        })
    })

    it('handles network error correctly', async () => {
        fetchMock.mockRejectOnce(new Error(NETWORK_ERR))

        const { result } = renderHook(() => useCountryByIp())

        act(() => {
            result.current.fetchCountryData(VALID_IP, true)
        })

        await waitFor(() => expect(result.current.loading).toBe(false))

        expect(result.current.reqStatus?.status).toBe(Status.Error)
        expect(result.current.reqStatus?.message).toBe(NETWORK_ERR)
    })

    it('handles server-side error correctly', async () => {
        fetchMock.mockResponseOnce(JSON.stringify({ message: ERR_FETCHING }), { status: 500 })

        const { result } = renderHook(() => useCountryByIp())

        act(() => {
            result.current.fetchCountryData(VALID_IP, true)
        })

        await waitFor(() => expect(result.current.loading).toBe(false))
        console.log(result.current)
        expect(result.current.reqStatus?.status).toBe(Status.Error)
        expect(result.current.reqStatus?.message).toEqual(ERR_FETCHING)
    })

    it('handles network loss correctly', async () => {
        fetchMock.mockRejectOnce(new Error(NETWORK_ERR))

        const { result } = renderHook(() => useCountryByIp())

        act(() => {
            result.current.fetchCountryData(VALID_IP, true)
        })

        await waitFor(() => expect(result.current.loading).toBe(false))
        await waitFor(() => expect(result.current.reqStatus?.status).toBe(Status.Error))

        expect(result.current.reqStatus?.message).toBe(NETWORK_ERR)
    })
})

