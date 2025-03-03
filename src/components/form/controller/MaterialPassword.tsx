import React, { useState } from "react";
import { TextField, InputAdornment, IconButton } from "@mui/material";
import { Eye, EyeOff } from "lucide-react";
import { Controller, useFormContext } from "react-hook-form";
import { cn } from "@/utils/cn";

interface MaterialPasswordProps {
  name: string;
  label: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  baseStyle?: any;
  className?: string;
  uppercase?: boolean;
}

const MaterialPassword: React.FC<MaterialPasswordProps> = ({
   name,
    label,
    baseStyle,
    className,
    uppercase,
  }: MaterialPasswordProps) => {
    const { control } = useFormContext();
  const [showPassword, setShowPassword] = useState(false);

  return (
    <>
    <Controller
        name={name}
        control={control}
        defaultValue=""
        render={({ field, fieldState: { error } }) => (
    <TextField
      type={showPassword ? "text" : "password"}
       {...field}
      value={field.value || ""}
      label={label}
      error={!!error}
      helperText={error?.message}
      onChange={(e) => {
        const value = uppercase
          ? e.target.value.toUpperCase()
          : e.target.value;
        field.onChange(value);
      }}
      sx={baseStyle}
      className={cn(className)}
      variant="outlined"
      fullWidth
      
      autoComplete="new-password"
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />} 
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  )}
  />
    </>
  );
};

export default MaterialPassword;
