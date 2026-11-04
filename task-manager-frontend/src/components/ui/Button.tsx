import React from 'react';
import { cn } from '../../lib/utils';
import { Spinner } from './Spinner';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      disabled,
      leftIcon,
      rightIcon,
      type = 'button',
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium transition-all duration-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98] leading-none';

    const variants = {
      primary:
        'bg-primary text-white hover:bg-primary-hover shadow-sm shadow-primary/20 dark:shadow-none focus:ring-primary',
      secondary:
        'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 hover:bg-slate-200 dark:hover:bg-slate-700 focus:ring-slate-400',
      outline:
        'border border-slate-300 dark:border-slate-700 bg-transparent text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/60 focus:ring-slate-400',
      ghost:
        'bg-transparent text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 focus:ring-slate-400',
      danger:
        'bg-rose-600 text-white hover:bg-rose-700 shadow-sm shadow-rose-200 dark:shadow-none focus:ring-rose-500',
    };

    const sizes = {
      sm: 'text-xs px-3 py-2 gap-1.5 min-h-[34px]',
      md: 'text-sm px-4 py-2.5 gap-2 min-h-[40px]',
      lg: 'text-base px-5 py-3 gap-2.5 min-h-[46px]',
    };

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {isLoading && <Spinner size="sm" className="shrink-0" />}
        {!isLoading && leftIcon && <span className="inline-flex items-center justify-center shrink-0">{leftIcon}</span>}
        {children && <span className="inline-flex items-center leading-none">{children}</span>}
        {!isLoading && rightIcon && <span className="inline-flex items-center justify-center shrink-0">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';
