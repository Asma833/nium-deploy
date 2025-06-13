import { Controller, useFormContext } from 'react-hook-form';
import { Button } from '@mui/material';
import { Upload } from 'lucide-react';

interface MaterialFileProps {
  name: string;
  label: string;
  className?: string;
}

export const MaterialFile = ({ name, label, className }: MaterialFileProps) => {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      defaultValue={null} // Add default value
      render={({ field: { value, onChange }, fieldState: { error } }) => (
        <div>
          <Button
            component="label"
            variant="outlined"
            startIcon={<Upload className="w-4 h-4" />}
            className={className || ''}
          >
            {value ? value.name : label}
            <input
              type="file"
              hidden
              onChange={(e) => {
                const file = e.target.files?.[0] || null;
                onChange(file); // Handle null case
              }}
            />
          </Button>
          {error && <p className="text-[hsl(var(--destructive))] text-sm mt-1">{error.message}</p>}
        </div>
      )}
    />
  );
};
