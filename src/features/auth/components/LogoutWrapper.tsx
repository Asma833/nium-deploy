import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
// import { authApi } from '../api/authApi';
import { logout } from '../store/authSlice';
import { toast } from 'sonner';
import { ConfirmationAlert } from '@/components/common/ConfirmationAlert';
import { ROUTES } from '@/core/constant/routePaths';

interface LogoutWrapperProps {
  children: React.ReactNode;
}

const LogoutWrapper: React.FC<LogoutWrapperProps> = ({ children }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      // await authApi.logoutUser();
      dispatch(logout());
      toast.success('Logged out successfully');
      // Redirect to login page after successful logout
      navigate(ROUTES.AUTH.LOGIN, { replace: true });
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
