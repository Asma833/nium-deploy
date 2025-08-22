import { cn } from '@/utils/cn';
import React from 'react';

interface CustomSquareCheckProps {
  color?: string; // check color
  size?: number; // icon size
  className?: string;
  fill?: string; // background fill
  selected?: boolean; // whether the radio is selected
}

const CustomSquareCheckIcon: React.FC<CustomSquareCheckProps> = ({
  color = 'white',
  size = 24,
  className = '',
  fill = '',
  selected = false,
}) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" className={cn(className)}>
    {/* Background square */}
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" fill={fill} />

    {/* Checkmark (bigger) */}
    {selected && (
      <path
        d="M7.5 13l3 3 6-6"
        fill="none"
        stroke={color}
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    )}
  </svg>
);

const CustomRadioIcon: React.FC<CustomSquareCheckProps> = ({
  color = 'white',
  size = 24,
  className = '',
  fill = '',
  selected = false,
}) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" className={cn(className)}>
    {/* Outer circle (radio border) */}
    <circle cx="12" cy="12" r="10" fill={fill} stroke={color} strokeWidth="2" />
    {/* Inner circle (selected indicator) */}
    {selected && <circle cx="12" cy="12" r="6" fill={color} />}
  </svg>
);

export { CustomSquareCheckIcon, CustomRadioIcon };
