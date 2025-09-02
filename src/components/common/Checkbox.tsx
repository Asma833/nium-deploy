import React from 'react';
import { Checkbox } from '@mui/material';
interface CustomCheckboxProps {
  rowId: string;
  value: boolean;
  label: string;
  requirementType: string;
  onChange: (rowId: string, isChecked: boolean) => void;
  disabled?: boolean;
}

export const CustomCheckbox: React.FC<CustomCheckboxProps> = ({
  rowId,
  value,
  label,
  requirementType,
  onChange,
  disabled,
}) => {
  return (
    <div className="flex flex-row gap-4 items-center justify-center">
      <label className="flex items-center gap-1">
        <Checkbox
          name={`${requirementType}-${rowId}`}
          checked={value}
          onChange={(e) => onChange(rowId, e.target.checked)}
          disabled={disabled}
          sx={{
            color: 'hsl(var(--primary))',
            '&.Mui-checked': {
              color: 'hsl(var(--primary))',
            },
            padding: '0px',
            height: '30px !important',
            width: '30px !important',
          }}
          size="small"
        />
        <span>{label}</span>
      </label>
    </div>
  );
};
