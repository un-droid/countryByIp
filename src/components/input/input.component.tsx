import { ChangeEvent, FormEvent, useState } from 'react'
import styles from './input.component.module.scss'
import useCountryByIp from '../../hooks/useCountryByIp'
import LookupResult from '../lookup-result/lookup.result.component'

type InputRowProps = {
    index: number
    placeholder?: string
    value?: string
}

const InputRow = ({ index, placeholder, value = '' }: InputRowProps) => {
console.log('input render')
    const [ip, setIp] = useState(value)
    const [formTouched, setFormTouched] = useState(false)
    
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

    return (
        <div className={styles['row-container']}>
            <form className={styles['input-form']} onSubmit={submitFetchRequest}>
                <label className={styles.index}>{index}</label>

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
}

export default InputRow