import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import React from 'react';

interface MUIProvidersProps {
  children: React.ReactNode;
}

export const MUIProviders: React.FC<MUIProvidersProps> = ({ children }) => {
  return <LocalizationProvider dateAdapter={AdapterDayjs}>{children}</LocalizationProvider>;
};
