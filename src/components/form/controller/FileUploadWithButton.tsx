import React from 'react';
import { Controller, FieldValues, Path } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';

type FileUploadWithButtonProps<T extends FieldValues> = {
  name: Path<T>;
  label: string;
  onUpload: (file: File) => void;
  disabled?: boolean;
};

export const FileUploadWithButton = <T extends FieldValues>({
  name,
  label,
  onUpload,
  disabled = false,
}: FileUploadWithButtonProps<T>) => {
  return (
    <Controller
      name={name}
      render={({ field }) => {
        const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
          const file = event.target.files?.[0];
          if (file) {
            field.onChange(file);
            onUpload(file);
          }
        };

        return (
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <input
                type="file"
                id={name}
                accept=".pdf,.jpg,.jpeg,.png,.gif"
                onChange={handleFileChange}
                disabled={disabled}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              {field.value && <div className="mt-2 text-sm text-gray-600">Selected: {field.value.name}</div>}
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={!field.value || disabled}
              onClick={() => field.value && onUpload(field.value)}
              className="flex items-center gap-2"
            >
              <Upload className="h-4 w-4" />
              Upload
            </Button>
          </div>
        );
      }}
    />
  );
};
