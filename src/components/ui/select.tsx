import React from 'react';
import { cn } from '../../lib/utils';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  onValueChange?: (value: string) => void;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, onValueChange, ...props }, ref) => {
    return (
      <select
        ref={ref}
        className={cn(
          'p-2 rounded-md bg-white border-2 border-black',
          'focus:outline-none focus:ring-2 focus:ring-black',
          className
        )}
        onChange={e => onValueChange?.(e.target.value)}
        {...props}
      />
    );
  }
);

Select.displayName = 'Select';