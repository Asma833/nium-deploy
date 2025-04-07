import { cn } from '@/utils/cn';
import React from 'react';

type Props = {
  children: React.ReactNode;
  className?: string;
};

const FlexEndRow = ({ children, className }: Props) => {
  return (
    <div className={cn('flex justify-end w-full', className)}>{children}</div>
  );
};

export default FlexEndRow;
