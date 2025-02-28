import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cn } from '../../lib/utils';

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  variant?: 'default' | 'ghost';
  size?: 'default' | 'sm';
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(
          'inline-flex items-center justify-center rounded-md font-medium ring-offset-white transition-colors',
          'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-black',
          'disabled:pointer-events-none disabled:opacity-50',
          variant === 'default' && 'bg-black text-white hover:bg-gray-800',
          variant === 'ghost' && 'hover:bg-gray-100 hover:text-gray-900',
          size === 'default' && 'h-9 px-4 py-2',
          size === 'sm' && 'h-8 px-3 text-sm',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';

export { Button };