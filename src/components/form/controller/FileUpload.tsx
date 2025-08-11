import { cn } from '@/utils/cn';
import { ChangeEvent } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import '../styles/form-layout.css';

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
  name = '',
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
      defaultValue={[]}
      render={({ field: { value, onChange }, fieldState: { error } }) => (
        <div className={cn('w-full p-3 flex flex-col gap-2', className)}>
          {styleType == 'default' && <span className="text-sm"> {label}</span>}

          <label htmlFor={id}>
            <div className="relative">
              <input
                id={id}
                type="file"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    // Transform file to match schema format
                    const fileData = {
                      file,
                      name: file.name,
                      size: file.size,
                      type: file.type,
                      lastModified: file.lastModified,
                    };
                    // Set as array to match schema
                    onChange([fileData]);
                  } else {
                    onChange([]);
                  }
                  handleChange(e);
                }}
                className="n-filetype-hidden"
                accept=".pdf,.jpg,.png"
              />
              {/* <button
                type="button"
                className="bg-gray-150 w-full h-full flex text-gray-500 text-[12px] rounded overflow-hidden hover:bg-gray-200 cursor-pointer"
              >
                <span className="text-nowrap font-semibold border-r-2 border-gray-400 py-2 pr-3 pl-4">Choose File</span>
                <span className="ml-2 text-gray-500 font-semibold px-2 py-2 text-left">
                  {value && value.length > 0 && value[0]?.name ? value[0].name : 'No file chosen'}
                </span>
              </button> */}

              <button
                type="button"
                className="bg-gray-150 w-full flex items-center text-gray-700 text-[13px] rounded border border-gray-300 hover:bg-gray-200 cursor-pointer"
              >
                <span className="whitespace-nowrap font-semibold border-r border-gray-300 py-2 pr-3 pl-4">
                  Choose File
                </span>
                <span className="ml-2 px-2 py-2 truncate w-full text-left">
                  {value && value.length > 0 && value[0]?.name ? value[0].name : 'No file chosen'}
                </span>
              </button>

            </div>
          </label>
        </div>
      )}
    />
  );
};
