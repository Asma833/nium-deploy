import { MaterialText } from "@/components/form/controller/MaterialText";
import { MaterialSelect } from "@/components/form/controller/MaterialSelect";
import { MaterialDatePicker } from "@/components/form/controller/MaterialDatePicker";
import { MaterialRadioGroup } from "@/components/form/controller/MaterialRadioGroup";
import { MaterialEmail } from "@/components/form/controller/MaterialEmail";
import { MaterialFile } from "@/components/form/controller/MaterialFile";
import { MaterialCheckbox } from "@/components/form/controller/MaterialCheckbox";
import { MaterialNumber } from "@/components/form/controller/MaterialNumber";
import  MaterialPassword  from "@/components/form/controller/MaterialPassword";

export const getController = (field: any) => {
  const fieldHeight = field.height || "45px";
  const baseStyle = {
    height: fieldHeight,
    color: "hsl(var(--foreground))",
    "& .MuiInputBase-input": {
      height: fieldHeight,
      color: "hsl(var(--foreground))",
      padding: "0 14px",
      "&.Mui-focused": {
        color: "hsl(var(--foreground))",
      },
    },
    "& .MuiInputLabel-root": {
      transform: "translate(14px, 11px) scale(1)",
      color: "hsl(var(--muted))",
      "&.Mui-focused": {
        color: "hsl(var(--primary))",
      },
    },
    "& .MuiInputLabel-root.Mui-focused": {
      transform: "translate(14px, -11px) scale(0.75)",
    },
    "& .MuiInputLabel-root.MuiFormLabel-filled": {
      transform: "translate(14px, -11px) scale(0.75)",
    },
    "& .MuiOutlinedInput-root": {
      color: "hsl(var(--foreground))",
      "& fieldset": {
        borderColor: "hsl(var(--border))",
      },
      "&:hover fieldset": {
        borderColor: "hsl(var(--primary))",
      },
      "&.Mui-focused fieldset": {
        borderColor: "hsl(var(--primary))",
      },
    },
    // Select dropdown icon
    "& .MuiSelect-icon": {
      color: "hsl(var(--muted))",
    },
    // Radio button
    "& .MuiRadio-root": {
      color: "hsl(var(--muted))",
      "&.Mui-checked": {
        color: "hsl(var(--primary))",
      },
    },
    // Date picker
    "& .MuiInputAdornment-root .MuiSvgIcon-root": {
      color: "hsl(var(--muted))",
    },
    // Menu items in select
    "& .MuiMenu-paper": {
      backgroundColor: "hsl(var(--background))",
      color: "hsl(var(--foreground))",
    },
    "& .MuiMenu-list .MuiMenuItem-root": {
      "&:hover": {
        backgroundColor: "hsl(var(--accent))",
      },
      "&.Mui-selected": {
        backgroundColor: "hsl(var(--accent))",
        "&:hover": {
          backgroundColor: "hsl(var(--accent))",
        },
      },
    },
    ...(field.error && {
      '& .MuiOutlinedInput-root': {
        '& fieldset': {
          borderColor: 'hsl(var(--destructive))',
        },
      },
    }),
  };
  const baseGeneralFieldStyle =
    "bg-[hsl(var(--background))] border border-[hsl(var(--border))] rounded-md text-[hsl(var(--foreground))] hover:border-[hsl(var(--primary))] focus:border-[hsl(var(--primary))]";

  const commonProps = {
    onChange: (e: any) => {
      console.log(`Field ${field.name} changed:`, e.target.value); // Debug log
    },
  };

  switch (field.type) {
    case "text":
      return (
        <MaterialText
          {...commonProps}
          name={field.name}
          label={field.label}
          uppercase={field.uppercase}
          baseStyle={baseStyle}
          className={baseGeneralFieldStyle}
        />
      );
    case "email":
      return (
        <MaterialEmail
          {...commonProps}
          name={field.name}
          label={field.label}
          baseStyle={baseStyle}
          className={baseGeneralFieldStyle}
        />
      );
    case "number":
      return (
        <MaterialNumber
          {...commonProps}
          name={field.name}
          label={field.label}
          baseStyle={baseStyle}
          className={baseGeneralFieldStyle}
        />
      );
    case "file":
      return (
        <MaterialFile
          {...commonProps}
          name={field.name}
          label={field.label}
          className={baseGeneralFieldStyle}
        />
      );
    case "checkbox":
      return (
        <MaterialCheckbox
          {...commonProps}
          name={field.name}
          label={field.label}
          options={field.options}
        />
      );
      
    case "select":
      return (
        <MaterialSelect
          {...commonProps}
          name={field.name}
          options={field.options}
          label={field.label}
          baseStyle={baseStyle}
          className={baseGeneralFieldStyle}
        />
      );
    case "date":
      return (
        <MaterialDatePicker
          {...commonProps}
          name={field.name}
          label={field.label}
          baseStyle={baseStyle}
          className={baseGeneralFieldStyle}
          error={field.error}
        />
      );
    case "radio":
      return (
        <MaterialRadioGroup
          {...commonProps}
          name={field.name}
          label={field.label}
          options={field.options}
        />
      );
      case "password":
      return <MaterialPassword 
      {...commonProps} 
      name={field.name} 
      label={field.label} 
      baseStyle={baseStyle} 
      className={baseGeneralFieldStyle} 
      />;
    default:
      return null;
  }
};


