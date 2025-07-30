'use client'

import React from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
  isLoading?: boolean
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  isLoading = false,
  className = '',
  disabled,
  ...props
}) => {
  const baseClasses =
    'inline-flex items-center justify-center font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'

  const variantClasses = {
    primary: 'btn-primary hover:bg-primary-hover text-white focus:ring-primary',
    secondary: 'bg-bg-secondary border border-border text-text hover:bg-bg-tertiary focus:ring-border',
    outline: 'border border-border text-text hover:bg-bg-secondary focus:ring-border',
    ghost: 'text-text hover:bg-bg-secondary focus:ring-border',
  }

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs rounded-md',
    md: 'px-4 py-2 text-sm rounded-md',
    lg: 'px-6 py-3 text-base rounded-lg',
  }

  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`

  return (
    <button className={classes} disabled={disabled || isLoading} {...props}>
      {isLoading ? (
        <>
          <div className='w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2' />
          Loading...
        </>
      ) : (
        children
      )}
    </button>
  )
}

export default Button
