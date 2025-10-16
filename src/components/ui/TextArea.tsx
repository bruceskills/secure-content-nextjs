import { cn } from '@/lib/utils';
import * as React from 'react';

const TextArea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
    ({ className, ...props }, ref) => {
        return (
            <textarea
                className={cn(
                    'flex min-h-[200px] w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50',
                    className,
                )}
                ref={ref}
                {...props}
            />
        );
    },
);

TextArea.displayName = 'TextArea';

export default TextArea;
