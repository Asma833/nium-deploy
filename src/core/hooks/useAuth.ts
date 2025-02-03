import { useContext } from 'react';
import { AuthContext } from '../../features/auth/context/AuthContext';
import { AuthContextType } from '../../features/auth/types/auth.types';

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
