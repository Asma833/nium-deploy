import { Controller, useFormContext } from "react-hook-form";
import { Button } from "@mui/material";
import { Upload } from "lucide-react";

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
      render={({ field: { onChange }, fieldState: { error } }) => (
        <div>
          <Button
            component="label"
            variant="outlined"
            startIcon={<Upload className="w-4 h-4" />}
            className={className || ''}
          >
            {label}
            <input
              type="file"
              hidden
              onChange={(e) => {
                onChange(e.target.files?.[0]);
              }}
            />
          </Button>
          {error && <p className="text-[hsl(var(--destructive))] text-sm mt-1">{error.message}</p>}
        </div>
      )}
    />
  );
};
