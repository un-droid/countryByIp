import { useEffect, useState } from "react"
import { getLocalTime } from "../../utils"

type TimeProps = {
    currentUnixTime: number
    timeZone?: string
}
const ONE_SECOND = 1000

const Time = ({ currentUnixTime, timeZone = 'UTC' }: TimeProps) => {
    const [time, setTime] = useState(currentUnixTime * 1000)

    useEffect(() => {
        if (!currentUnixTime || currentUnixTime <= 0) return
        const t_id = setInterval(() => {
            setTime((prevTime) => prevTime + ONE_SECOND)
        }, ONE_SECOND)

        return () => clearInterval(t_id)
    }, [currentUnixTime])

    const formattedTime = getLocalTime(time, timeZone)

    return <span>{formattedTime}</span>
}

export default Time
