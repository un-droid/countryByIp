import { useEffect, useState } from "react"
import { getLocalTime } from "../../utils"
import { DEFAULT_DATE } from "../../consts"

type TimeProps = {
    currentUnixTime: number
    timeZone?: string
}
const ONE_SECOND = 1000

const Time = ({ currentUnixTime, timeZone = 'UTC' }: TimeProps) => {
    const [time, setTime] = useState(() => {
        if (!currentUnixTime || currentUnixTime <= 0) {
            return new Date(DEFAULT_DATE)
        }
        return new Date(currentUnixTime * ONE_SECOND)
    })

    useEffect(() => {
        if (currentUnixTime <= 0) return
        const t_id = setInterval(() => {
            setTime((prevTime) => {
                return new Date(prevTime.getTime() + ONE_SECOND)
            })
        }, ONE_SECOND)

        return () => clearInterval(t_id)
    }, [currentUnixTime])

    const formattedTime = getLocalTime(time.getTime(), timeZone)

    return <span>{formattedTime}</span>
}

export default Time