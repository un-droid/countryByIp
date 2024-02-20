import styles from './spinner.component.module.scss'
type SpinnerProps = {
    width?: string
    height?: string
}
const Spinner = ({width= '26px', height= '26px' }: SpinnerProps) => {
    return (
        <svg className={styles.spinner} width={width} height={height} viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg">
            <circle className={styles.path} fill="none" strokeWidth="6" strokeLinecap="round" cx="33" cy="33" r="30" />
        </svg>
    )
}

export default Spinner
