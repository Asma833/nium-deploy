
interface FieldWithStyleProps {
  height?: string;
  error?: boolean;
}

export const baseGeneralFieldStyle = 'bg-transparent ';

export const baseStyle = (field: FieldWithStyleProps) => {
  const fieldHeight = field.height || '';

  return {
    height: fieldHeight,
    minHeight: '45px',
    color: 'hsl(var(--foreground))',
    '& .MuiInputBase-input': {
      height: fieldHeight,
      minHeight: '45px',
      color: 'hsl(var(--foreground))',
      padding: '0 14px',
      '&.Mui-focused': {
        color: 'hsl(var(--foreground))',
      },
    },
    '& .MuiInputLabel-root': {
      transform: 'translate(14px, 11px) scale(1)',
      color: 'hsl(var(--muted))',
      '&.Mui-focused': {
        color: 'hsl(var(--primary))',
      },
    },
    '& .MuiInputLabel-root.Mui-focused': {
      transform: 'translate(14px, -11px) scale(0.75)',
    },
    '& .MuiInputLabel-root.MuiFormLabel-filled': {
      transform: 'translate(14px, -11px) scale(0.75)',
    },
    '& .MuiOutlinedInput-root': {
      color: 'hsl(var(--foreground))',
      '& fieldset': {
        borderColor: 'hsl(var(--border))',
      },
      '&:hover fieldset': {
        borderColor: 'hsl(var(--primary))',
      },
      '&.Mui-focused fieldset': {
        borderColor: 'hsl(var(--primary))',
      },
    },
    // Select dropdown icon
    '& .MuiSelect-icon': {
      color: 'hsl(var(--muted))',
    },
    // Radio button
    '& .MuiRadio-root': {
      color: 'hsl(var(--muted))',
      '&.Mui-checked': {
        color: 'hsl(var(--primary))',
      },
    },
    // Date picker
    '& .MuiInputAdornment-root .MuiSvgIcon-root': {
      color: 'hsl(var(--muted))',
    },
    // Menu items in select
    '& .MuiMenu-paper': {
      backgroundColor: 'hsl(var(--background))',
      color: 'hsl(var(--foreground))',
    },
    '& .MuiMenu-list .MuiMenuItem-root': {
      '&:hover': {
        backgroundColor: 'hsl(var(--accent))',
      },
      '&.Mui-selected': {
        backgroundColor: 'hsl(var(--accent))',
        '&:hover': {
          backgroundColor: 'hsl(var(--accent))',
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
};
