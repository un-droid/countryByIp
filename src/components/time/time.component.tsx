import { useEffect, useState } from "react"
import { getLocalTime } from "../../utils"

type TimeProps = {
    currentUnixTime: number | undefined
}

const Time = ({ currentUnixTime }: TimeProps) => {
    const [time, setTime] = useState(new Date(currentUnixTime || 0))

    useEffect(() => {
        const t_id = setInterval(() => {
            setTime((prevTime) => {
                return new Date(prevTime.getTime() + 1)
            })
        }, 1000)

        return () => clearInterval(t_id)
    }, [currentUnixTime])

    const formattedTime = getLocalTime(time.getTime())

    return <span>{formattedTime}</span>
}

export default Time