import { cn } from '@/utils/cn';
import { ChangeEvent } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

interface FileUpload {
  id?: string;
  name: string;
  label: string;
  className?: string;
  maxFiles?: number;
  description?: string;
  helpText?: string;
  accept?: string;
  multiple?: boolean;
  handleFileChange?: (e: ChangeEvent<HTMLInputElement> | null) => void;
  styleType?: 'default' | 'fileUploadWithView';
  defaultValue?: File | null;
}

export const FileUpload = ({
  id,
  name,
  label,
  className,
  handleFileChange,
  styleType = 'default',
  defaultValue,
}: FileUpload) => {
  const { control } = useFormContext();

  const handleChange = (e: ChangeEvent<HTMLInputElement> | null) => {
    if (!handleFileChange) return;
    handleFileChange(e);
  };

  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue || null}
      render={({ field: { value, onChange }, fieldState: { error } }) => (
        <div className={cn('w-full p-3 flex flex-col gap-2', className)}>
          {styleType == 'default' && <span className="text-sm"> {label}</span>}

          <label htmlFor={id}>
            <div className="relative">
              <input
                id={id}
                type="file"
                onChange={(e) => {
                  const file = e.target.files?.[0] || null;
                  onChange(file);
                  handleChange(e);
                }}
                className="n-filetype-hidden"
                accept=".pdf,.jpg,.png"
              />
              <button
                type="button"
                className="bg-[#ededed] w-full h-full cursor-pointer flex  text-gray-500 text-[12px] rounded overflow-hidden hover:bg-gray-200"
              >
                <span className="text-nowrap font-semibold border-r-2 border-gray-400 py-2 pr-3 pl-4">
                  Choose File
                </span>
                <span className="ml-2 text-gray-500 font-semibold px-4 py-2">
                  {value ? value.name : 'No file chosen'}
                </span>
              </button>
            </div>
          </label>
          {error && (
            <p className="text-[hsl(var(--destructive))] text-sm mt-1">
              {error.message}
            </p>
          )}
        </div>
      )}
    />
  );
};
