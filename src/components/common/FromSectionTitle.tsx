import { cn } from '@/utils/cn';
import React from 'react';

type Props = {
  className?: string;
  children?: React.ReactNode;
};

const FromSectionTitle = (props: Props) => {
  const { className, children } = props;
  return <span className={cn('w-full border-b border-gray-300 mb-3', className)}>{children}</span>;
};

export default FromSectionTitle;
