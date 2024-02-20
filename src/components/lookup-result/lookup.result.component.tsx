import { faTriangleExclamation } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Spinner from '../spinner/spinner.component'

import styles from './lookup.result.component.module.scss'
import Time from '../time/time.component'
import { LookupResultData, Status } from '../../types'

type LookupResultProps = {
    result: LookupResultData | null
    loading: boolean
}

const LookupResult = ({ result, loading }: LookupResultProps) => {
    if (loading) return <Spinner />

    const getActionResult = () => {
        if (!result) return

        if (result.status === Status.Error || result.status === Status.Warning) {
            return (
                <>
                    <FontAwesomeIcon icon={faTriangleExclamation} className={styles[`icon-${result.status}`]} />
                    <span>{result.message}</span>
                </>
            )
        }

        if (result.status === Status.Success && result.data) {
            return (
                <>
                    <img src={result.data.countryFlag} className={styles['country-image']} />
                    <Time currentUnixTime={result.data.unixTime} />
                </>
            )
        }
    }

    return (
        <div className={styles['result-container']}>
            {getActionResult()}
        </div>
    )
}

export default LookupResult