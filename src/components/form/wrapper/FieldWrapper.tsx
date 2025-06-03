import React from 'react';
import { cn } from '@/utils/cn';
import '@/components/form/styles/form-layout.css';

type PropsType = {
  id?: string;
  children: React.ReactNode;
  className?: string;
  rowCols?: number | string;
  flexdirection?: string;
  error?: string;
};

const FieldWrapper = ({
  id,
  children,
  className = '',
  flexdirection,
  error,
  ...props
}: PropsType) => {
  return (
    <div
      id={id}
      {...props}
      className={cn(
        'fieldWrapper',
        className,
        flexdirection ? 'flex-' + flexdirection : 'flex-col'
      )}
    >
      {children}
      {error && (
        <span className="text-sm text-[hsl(var(--destructive))]">{error}</span>
      )}
    </div>
  );
};

export default FieldWrapper;
