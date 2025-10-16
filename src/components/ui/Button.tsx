import { cn } from '@/lib/utils';
import { type ButtonHTMLAttributes, forwardRef } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'default' | 'outline' | 'ghost';
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(({ className, variant = 'default', ...props }, ref) => {
    return (
        <button
            className={cn(
                'inline-flex items-center justify-center rounded-md px-4 py-2 font-medium text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
                {
                    'bg-blue-600 text-white hover:bg-blue-700': variant === 'default',
                    'border border-gray-300 bg-transparent hover:bg-gray-100': variant === 'outline',
                    'hover:bg-gray-100': variant === 'ghost',
                },
                className,
            )}
            ref={ref}
            {...props}
        />
    );
});

Button.displayName = 'Button';

export default Button;
