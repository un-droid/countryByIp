import { faPlus, faXmark } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

import styles from './ip.lookup.component.module.scss'
import Button from "../button/button.component"
import IPInput from "../input/ip.input.component"
import { useCallback, useState } from "react"
import { simpleUUID } from "../../utils"

export const IP_LOOKUP_TITLE = 'IP Lookup'
export const ADD = 'Add'
export const IP_LOOKUP_BODY = 'Enter one or more IP addresses and get their country'

type IPInputType = {
    inputIndex: number
    value?: string
    placeholder?: string
    id: string
}

const Lookup = () => {
    const [rows, setRows] = useState<IPInputType[]>([{ inputIndex: 1, id: simpleUUID() }])

    const handleAdd = useCallback(() => {
        setRows((prevRows: IPInputType[]) => {
            const currentRows = [...prevRows]
            const nextInputIndex = currentRows[currentRows.length - 1].inputIndex + 1
            currentRows.push({ value: '', inputIndex: nextInputIndex, id: simpleUUID() })
            return currentRows
        })
    }, [])

    const handleRemoveRow = useCallback((index: number) => {
        setRows((prevRows) => {
            const newRows = prevRows.filter(row => row.inputIndex !== index)
            return newRows.map((row, index) => ({ ...row, inputIndex: index +1 }))
        })
    }, [])

    return (
        <div className={styles['lookup-container']}>
            <div className={styles['lookup-header']}>
                <header>{IP_LOOKUP_TITLE}</header>
                <FontAwesomeIcon icon={faXmark} className={styles['lookup-header-close']} />
            </div>
            <main className={styles['lookup-body']}>
                <div className={styles['lookup-add-row']}>
                    <p>{IP_LOOKUP_BODY}</p>
                    <Button onClick={handleAdd}>
                        <FontAwesomeIcon icon={faPlus} />
                        <span>{ADD}</span>
                    </Button>
                </div>
                {rows.map((row: IPInputType) => {
                    return <IPInput key={row.id}
                        index={row.inputIndex}
                        value={row.value}
                        placeholder={row.placeholder}
                        onRemoveRow={handleRemoveRow}
                        isLastInput={rows.length === 1}
                    />
                })}
            </main>
        </div>
    )
}

export default Lookup