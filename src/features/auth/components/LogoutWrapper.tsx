import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { authApi } from '../api/authApi';
import { logout } from '../store/authSlice';
import { toast } from 'sonner';
import { ConfirmationAlert } from '@/components/common/ConfirmationAlert';

interface LogoutWrapperProps {
  children: React.ReactNode;
}

const LogoutWrapper: React.FC<LogoutWrapperProps> = ({ children }) => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    setIsLoading(true);
    dispatch(logout());
    try {
      await authApi.logoutUser();
      dispatch(logout());
      toast.success('Logged out successfully');
    } catch (error) {
      toast.error('Failed to logout');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ConfirmationAlert
      title="Confirm Logout"
      description="Are you sure you want to logout from your account?"
      onConfirm={handleLogout}
      isLoading={isLoading}
    >
      {children}
    </ConfirmationAlert>
  );
};

export default LogoutWrapper;
