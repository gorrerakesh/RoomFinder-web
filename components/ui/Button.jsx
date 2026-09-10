import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';

const Button = forwardRef(
  ({ className, variant = 'default', size = 'md', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 disabled:opacity-50 disabled:pointer-events-none",
          {
            'bg-primary-600 text-white hover:bg-primary-700': variant === 'default',
            'border border-border bg-transparent hover:bg-muted': variant === 'outline',
            'hover:bg-muted text-foreground': variant === 'ghost',
            'underline-offset-4 hover:underline text-primary-600': variant === 'link',
            'bg-red-500 text-white hover:bg-red-600': variant === 'danger',
            'h-9 px-3 text-sm': size === 'sm',
            'h-11 px-6 py-2': size === 'md',
            'h-12 px-8 text-lg': size === 'lg',
            'h-10 w-10': size === 'icon',
          },
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button };
