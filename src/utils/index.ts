import { CountryResponse, RawCountryData } from "../types"

export const isValidIp = (ip: string): boolean => {
    const regex = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/
    return regex.test(ip)
}

export const getLocalTime = (unixTime: number): string => {
    const date = new Date(unixTime * 1000)

    const options: Intl.DateTimeFormatOptions = {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    }

    return date.toLocaleTimeString('en-US', options)
}

export const extractCountryData = (rawData: RawCountryData): CountryResponse => {

    const countryData: CountryResponse = {
        countryFlag: rawData?.country_flag,
        countryName: rawData?.country_name,
        localTime: getLocalTime(rawData?.time_zone?.current_time_unix),
        unixTime: rawData?.time_zone?.current_time_unix,
    }
    return countryData
}