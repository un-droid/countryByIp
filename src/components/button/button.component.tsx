type ButtonVariants = 'primary' | 'secondary'

type ButtonProps = {
    children: React.ReactNode
    variant?: ButtonVariants
} & React.ButtonHTMLAttributes<HTMLButtonElement>

import styles from './button.component.module.scss'

const Button = ({variant = 'primary', children, ...props}: ButtonProps) => {
    const variantClass = styles[`button-${variant}`]
    
    return (
        <button className={`${styles.button} ${variantClass}`} {...props}>{children}</button>
    )
}

export default Button