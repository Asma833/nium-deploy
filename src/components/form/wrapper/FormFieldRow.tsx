import React from 'react';
import { cn } from '@/utils/cn';
import '../styles/form-layout.css';

type Props = {
  children: React.ReactNode;
  className?: string;
  wrapperClassName?: string;
  rowCols?: number | string;
  groupName?: string;
};

const FormFieldRow = ({ children, className, groupName, rowCols, wrapperClassName }: Props) => {
  return (
    <div className={cn('flex flex-col gap-3 px-1', className)}>
      {groupName && <div className="font-bold pt-3">{groupName}</div>}
      <div className={cn('formFieldRow', rowCols ? `row-cols-${rowCols}` : '', wrapperClassName)}>{children}</div>
    </div>
  );
};

export default FormFieldRow;
