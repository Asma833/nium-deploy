import { Loader as LucideLoader } from 'lucide-react';
import { TableDataLoaderProps } from '../../types/common-components.types';

const TableDataLoader = ({ text = 'Fetching...' }: TableDataLoaderProps) => {
  return (
    <div className="flex justify-center items-center gap-2">
      <LucideLoader
        className="animate-spin"
        style={{ animationDuration: '1.5s' }}
      />
      {text}
    </div>
  );
};

export default TableDataLoader;
