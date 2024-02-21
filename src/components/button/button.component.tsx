import React from 'react'
import styles from './button.component.module.scss'

// in theory we can suppurt multi-variant button. here we only use primary
type ButtonVariants = 'primary' | 'secondary'

type ButtonProps = {
    children: React.ReactNode
    variant?: ButtonVariants
} & React.ButtonHTMLAttributes<HTMLButtonElement>

const Button = React.memo(({variant = 'primary', children, ...props}: ButtonProps) => {
    const variantClass = styles[`button-${variant}`]
    
    return (
        <button className={`${styles.button} ${variantClass}`} {...props}>{children}</button>
    )
})

export default Button