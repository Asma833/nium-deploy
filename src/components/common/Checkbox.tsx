import React from 'react';
import { Checkbox } from '@mui/material';

interface CustomCheckboxProps {
  rowId: string;
  value: boolean; // Changed from string to boolean
  label: string;
  requirementType: string;
  onChange: (rowId: string, isChecked: boolean) => void; // Changed to boolean
}

export const CustomCheckbox: React.FC<CustomCheckboxProps> = ({ rowId, value, label, requirementType, onChange }) => {
  return (
    <div className="flex flex-row gap-4 items-center justify-center">
      <label className="flex items-center gap-1">
        <Checkbox
          name={`${requirementType}-${rowId}`}
          checked={value}
          onChange={(e) => onChange(rowId, e.target.checked)}
          sx={{
            color: '#E53888',
            '&.Mui-checked': {
              color: '#E53888',
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
