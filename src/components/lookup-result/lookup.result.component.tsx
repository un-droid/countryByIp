import { IconDefinition, faCircleInfo, faTriangleExclamation } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Spinner from '../spinner/spinner.component'

import styles from './lookup.result.component.module.scss'
import Time from '../time/time.component'
import { LookupResultData, Status } from '../../types'
import React from 'react'

type LookupResultProps = {
    result: LookupResultData | null
    loading: boolean
}

const LookupResult = React.memo(({ result, loading }: LookupResultProps) => {
    if (loading) return <Spinner />
    if (!result) return null

    const renderStatusMessage = (result: LookupResultData) => {
        let icon: IconDefinition

        switch (result.status) {
            case Status.Info:
            case Status.Warning:
            case Status.Error:
                icon = result.status === Status.Info ? faCircleInfo : faTriangleExclamation
                return (
                    <>
                        <FontAwesomeIcon icon={icon} className={`${styles.icon} ${styles[`icon-${result.status}`]}`} />
                        <span>{result.message}</span>
                    </>
                )
            case Status.Success:
                return (
                    <>
                        {result.data ? (
                            <>
                                <img src={result.data.countryFlag} className={styles['country-image']} alt={result.data.countryName} />
                                <Time currentUnixTime={result.data.unixTime} timeZone={result.data.timeZone} />
                            </>
                        ) : null}

                    </>
                )
            default:
                return null
        }

    }
    return (
        <div className={styles['result-container']}>
            {renderStatusMessage(result)}
        </div>
    )
})

export default LookupResult