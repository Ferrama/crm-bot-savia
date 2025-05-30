// components/Loader.tsx
import { Loader2 as LoaderIcon } from 'lucide-react';
import React from 'react';
import { cn } from '../../helpers/cn';


const sizeClasses = {
  sm: 'h-4 w-4',
  md: 'h-6 w-6',
  lg: 'h-8 w-8',
};

export const Loader = ({
  className,
  iconClassName,
  size = 'md',
  ...props
}) => {
  return (
    <div
      className={cn('flex items-center justify-center', className)}
      {...props}
    >
      <LoaderIcon
        className={cn(
          sizeClasses[size],
          'animate-[spin_2s_linear_infinite] text-primary-500',
          iconClassName
        )}
      />
    </div>
  );
};
