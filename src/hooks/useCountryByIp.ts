import { useState } from 'react';
import { CountryResponse, LookupResultData, Status } from '../types';
import { BASE_URL } from '../consts';
import { extractCountryData, isValidIp } from '../utils';

export const initialData: CountryResponse = {
    countryFlag: '',
    countryName: '',
    localTime: '',
    unixTime: 0,
    timeZone: ''
}

export const INVALID_IP_MSG = 'Please enter a valid IP address'
const NETWORK_ERR = 'Network response was not ok'
const UNEXPECTED_ERR = 'An unexpected error occurred'

export default function useCountryByIp() {
    const [loading, setLoading] = useState(false)
    const [reqStatus, setReqStatus] = useState<LookupResultData | null>({ status: Status.Idle, data: initialData })

    const fetchCountryData = async (ip: string, formTouched: boolean) => {
        if (!isValidIp(ip)) {
            // if the form is dirty set an error, otherwise just abort the request
            formTouched && setReqStatus({ data: null, status: Status.Warning, message: INVALID_IP_MSG })
            return
        }
        setLoading(true)

        try {
            const response = await fetch(`${BASE_URL}/getCountryByIp?ip=${ip}`)
            const responseData = await response.json()

            if (!response.ok) {
                const errorMessage = responseData.message || NETWORK_ERR
                setReqStatus({ status: response.status === 422 ? Status.Info : Status.Error, data: null, message: errorMessage })
                return
            }

            setReqStatus({ status: Status.Success, data: extractCountryData(responseData) })
        } catch (error) {
            setReqStatus({ status: Status.Error, data: null, message: (error as Error).message || UNEXPECTED_ERR })
        } finally {
            setLoading(false)
        }
    }

    const handleStateReset = (newStatusState: Status) => {
        setReqStatus((prevState: LookupResultData | null) => {
            // if prevState is null, initialize it with a default value
            if (!prevState) {
                return { status: Status.Idle, data: initialData }
            }

            // otherwise
            return {
                ...prevState,
                status: newStatusState,
            }
        })
    }

    return { loading, reqStatus, fetchCountryData, handleStateReset }
}