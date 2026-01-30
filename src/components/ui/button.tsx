import { ButtonHTMLAttributes, forwardRef } from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'outline' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
        return (
            <button
                ref={ref}
                className={cn(
                    // Base styles
                    'inline-flex items-center justify-center rounded-full font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50',
                    // Variants
                    {
                        'bg-[var(--primary)] text-white hover:bg-[#B59669] shadow-lg shadow-[#C6A87C]/20': variant === 'primary',
                        'border-2 border-[var(--foreground)] bg-transparent hover:bg-[var(--foreground)] hover:text-white': variant === 'outline',
                        'hover:bg-[var(--muted)] text-[var(--foreground)]': variant === 'ghost',
                    },
                    // Sizes
                    {
                        'h-9 px-4 text-sm': size === 'sm',
                        'h-11 px-8 text-base': size === 'md',
                        'h-14 px-10 text-lg': size === 'lg',
                    },
                    className
                )}
                {...props}
            />
        );
    }
);
Button.displayName = 'Button';

export { Button, cn };
