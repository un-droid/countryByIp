import { faPlus, faXmark } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

import styles from './lookup.component.module.scss'
import Button from "../button/button.component"
import InputRow from "../input/input.component"
import { useCallback, useState } from "react"

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
        setRows((prevRows: InputRowType[]) => {
            const currentRows = [...prevRows]
            const nextInputIndex = currentRows[currentRows.length - 1].inputIndex + 1
            currentRows.push({ value: '', inputIndex: nextInputIndex })
            return currentRows
        })
    }

    const handleRemoveRow = useCallback((index: number) => {
        setRows((prevRows: InputRowType[]) => {
            return [...prevRows].filter(row => row.inputIndex !== index)
        })
    },[])

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
                        onRemoveRow={handleRemoveRow}
                        isLastInput={rows.length === 1}
                    />
                })}
            </div>
        </div>
    )
}

export default Lookup