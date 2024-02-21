import { CountryResponse, RawCountryData } from "../types"

export const isValidIp = (ip: string): boolean => {
    const regex = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/
    return regex.test(ip)
}

export const getLocalTime = (unixTime: number, timeZone: string = 'UTC'): string => {
    if (unixTime <= 0) return "00:00:00"
    
    const date = new Date(unixTime)

    const options: Intl.DateTimeFormatOptions = {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
        timeZone
    }

    return new Intl.DateTimeFormat('en-US', options).format(date)
}

export const extractCountryData = (rawData: RawCountryData): CountryResponse => {

    const countryData: CountryResponse = {
        countryFlag: rawData?.country_flag,
        countryName: rawData?.country_name,
        localTime: getLocalTime(rawData?.time_zone?.current_time_unix),
        unixTime: rawData?.time_zone?.current_time_unix,
        timeZone: rawData?.time_zone?.name
    }
    return countryData
}