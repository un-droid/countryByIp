import { faPlus, faXmark } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

import styles from './lookup.component.module.scss'
import Button from "../button/button.component"
import InputRow from "../input/input.component"
import { useState } from "react"

export const IP_LOOKUP_TITLE = 'IP Lookup'
export const ADD = 'Add'
export const IP_LOOKUP_BODY = 'Enter one or more IP addresses and get their country'

type InputRowType = {
    inputIndex: number
    value?: string
    placeholder?: string
}

const Lookup = () => {
    const [rows, setRows] = useState<InputRowType[]>([{inputIndex: 1}])

    const handleAdd = () => {
        setRows((prev: InputRowType[]) => {
            const currentRows = [...prev]
            const nextInputIndex = currentRows[currentRows.length - 1].inputIndex + 1
            currentRows.push({ value: '', inputIndex: nextInputIndex })
            return currentRows
        })
    }

    return (
        <div className={styles['lookup-container']}>
            <div className={styles['lookup-header']}>
                <header>{IP_LOOKUP_TITLE}</header>
                <FontAwesomeIcon icon={faXmark} className={styles['lookup-header-close']} />
            </div>
            <div className={styles['lookup-body']}>
                <div className={styles['lookup-add-row']}>
                    <p>{IP_LOOKUP_BODY}</p>
                    <Button onClick={handleAdd}>
                        <FontAwesomeIcon icon={faPlus} />
                        <span>{ADD}</span>
                    </Button>
                </div>
                {rows.map((row: InputRowType) => {
                    return <InputRow key={row.inputIndex}
                        index={row.inputIndex}
                        value={row.value}
                        placeholder={row.placeholder}
                    />
                })}
            </div>
        </div>
    )
}

export default Lookup