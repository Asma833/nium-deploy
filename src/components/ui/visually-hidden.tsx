import * as React from 'react';
import { cn } from '@/utils/cn';

interface VisuallyHiddenProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
}

const VisuallyHidden = React.forwardRef<HTMLSpanElement, VisuallyHiddenProps>(
  ({ className, children, ...props }, ref) => (
    <span ref={ref} className={cn('sr-only', className)} {...props}>
      {children}
    </span>
  )
);
VisuallyHidden.displayName = 'VisuallyHidden';

export { VisuallyHidden };
