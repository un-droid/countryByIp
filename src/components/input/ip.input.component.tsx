import { ChangeEvent, FormEvent, useState } from 'react'
import styles from './ip.input.component.module.scss'
import useCountryByIp from '../../hooks/useCountryByIp'
import LookupResult from '../lookup-result/lookup.result.component'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash } from '@fortawesome/free-solid-svg-icons'
import React from 'react'
import { Status } from '../../types'

type IPInputProps = {
    index: number
    placeholder?: string
    value?: string
    onRemoveRow: (index: number) => void
    isLastInput: boolean
}

const IPInput = React.memo(({ index, placeholder, value = '', onRemoveRow, isLastInput }: IPInputProps) => {
    const [ip, setIp] = useState(value)
    const [formTouched, setFormTouched] = useState(false)
    const [isHovered, setIsHovered] = useState(false)
    const [isRemoving, setIsRemoving] = useState(false)

    const { loading, reqStatus, fetchCountryData, handleStateReset } = useCountryByIp()

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setFormTouched(true)
        handleStateReset(Status.Idle)
        const { value } = e.target
        // prevents the user from entering anything else but 0-9 and '.'
        const regex = /^[0-9.]*$/

        if (regex.test(value)) {
            setIp(value)
        }
    }

    const submitFetchRequest = (e: FormEvent) => {
        e.preventDefault()
        fetchCountryData(ip, formTouched)
    }

    const handleRemoveRow = () => {
        if (isLastInput) return
        setIsRemoving(true)
    }

    return (
        <div className={`${styles['row-container']} ${isRemoving ? styles.removing : ''}`}
            onAnimationEnd={() => isRemoving && onRemoveRow(index)}>
            <form className={styles['input-form']} onSubmit={submitFetchRequest}>
                <label className={styles.index}
                    onMouseEnter={() => !isLastInput && setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    onClick={handleRemoveRow}
                    data-testid={`remove-row-${index}`}
                >{isHovered ? <FontAwesomeIcon icon={faTrash} className={styles['remove-row-icon']} /> : index}</label>

                <input type="text"
                    onChange={handleChange}
                    className={`${styles.input} ${styles[`input-${reqStatus?.status}`]}`}
                    placeholder={placeholder} // in theory we can pass a placeholder for the input
                    onBlur={submitFetchRequest}
                    value={ip}
                    disabled={loading}
                />
            </form>
            <LookupResult loading={loading} result={reqStatus} />
        </div>
    )
})

export default IPInput