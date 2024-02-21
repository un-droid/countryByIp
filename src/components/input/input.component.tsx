import { ChangeEvent, FormEvent, useState } from 'react'
import styles from './input.component.module.scss'
import useCountryByIp from '../../hooks/useCountryByIp'
import LookupResult from '../lookup-result/lookup.result.component'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'
import React from 'react'

type InputRowProps = {
    index: number
    placeholder?: string
    value?: string
    onRemoveRow: (index: number) => void
    isLastInput: boolean
}

const InputRow = React.memo(({ index, placeholder, value = '', onRemoveRow, isLastInput }: InputRowProps) => {
    const [ip, setIp] = useState(value)
    const [formTouched, setFormTouched] = useState(false)
    const [isHovered, setIsHovered] = useState(false)

    const { loading, reqStatus, fetchCountryData } = useCountryByIp()

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setFormTouched(true)
        const { value } = e.target
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
        onRemoveRow(index)
    }

    return (
        <div className={styles['row-container']}>
            <form className={styles['input-form']} onSubmit={submitFetchRequest}>
                <label className={styles.index}
                    onMouseEnter={() => !isLastInput && setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    onClick={handleRemoveRow}
                    data-testid={`remove-row-${index}`}
                >{isHovered ? <FontAwesomeIcon icon={faXmark} className={styles['remove-row-icon']} /> : index}</label>

                <input type="text"
                    onChange={handleChange}
                    className={styles.input}
                    placeholder={placeholder}
                    onBlur={submitFetchRequest}
                    value={ip}
                    disabled={loading}
                />
            </form>
            <LookupResult loading={loading} result={reqStatus} />
        </div>
    )
})

export default InputRow