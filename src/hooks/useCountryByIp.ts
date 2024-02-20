import { useState } from 'react';
import { CountryResponse, LookupResultData, RawCountryData, Status } from '../types';
import { BASE_URL } from '../consts';
import { extractCountryData, isValidIp } from '../utils';

const initialData: CountryResponse = {
    countryFlag: '',
    countryName: '',
    localTime: '',
    unixTime: undefined
}

const INVALID_IP = 'Please enter a valid ip adress'
const NETWORK_ERR = 'Network response was not ok'
const UNEXPECTED_ERR = 'An unexpected error occurred'

export default function useCountryByIp() {
    const [loading, setLoading] = useState(false)
    const [reqStatus, setReqStatus] = useState<LookupResultData | null>({ status: Status.Idle, data: initialData })

    const fetchCountryData = async (ip: string, formTouched: boolean) => {
        if (!isValidIp(ip)) {
            // if the form is dirty set an error, otherwise just abort the request
            formTouched && setReqStatus({ data: null, status: Status.Warning, message: INVALID_IP })
            return
        }
        setLoading(true)
        setReqStatus(null)

        try {
            const response = await fetch(`${BASE_URL}/getCountryByIp?ip=${ip}`)
            if (!response.ok) {
                const errorResponse: { message?: string } = await response.json()
                setReqStatus({ status: Status.Error, data: null, message: errorResponse.message || NETWORK_ERR })
            }
            const countryData: RawCountryData = await response.json()
            setReqStatus({ status: Status.Success, data: extractCountryData(countryData) })
        } catch (error) {
            setReqStatus({ status: Status.Error, data: null, message: (error as Error).message || UNEXPECTED_ERR })
        } finally {
            setLoading(false)
        }
    }

    return { loading, reqStatus, fetchCountryData }
}