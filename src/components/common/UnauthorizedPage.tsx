import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { ShieldAlert } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { useCurrentUser } from '@/utils/getUserFromRedux';
import { DEFAULT_ROUTES } from '@/core/constant/manageDefaultRoutes';
import { clearAllQueryCache } from '@/core/services/query/queryCacheManager';
import { logout } from '@/features/auth/store/authSlice';
import { ROUTES } from '@/core/constant/routePaths';

const UnauthorizedPage = () => {
  const { getUser } = useCurrentUser();
  const user = getUser();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleGoBack = () => {
    if (user?.role?.name) {
      const defaultRoute = DEFAULT_ROUTES[user.role.name as keyof typeof DEFAULT_ROUTES];
      navigate(defaultRoute || '/login');
    } else {
      navigate('/login');
    }
  };
  const handleLogout = async () => {
    setIsLoading(true);
    try {
      // Clear all React Query cache to prevent data leakage between users
      await clearAllQueryCache();

      // Clear Redux auth state
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
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8 text-center">
        <div className="mb-6">
          <ShieldAlert className="text-red-500 mx-auto" size={'60px'} />
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>

        <p className="text-gray-600 mb-8">
          You don't have permission to access this page. Please contact your administrator if you believe this is an
          error.
        </p>

        <div className="space-y-4">
          <button
            onClick={handleGoBack}
            className="w-full bg-primary hover:bg-primary/60 text-white font-medium py-2 px-4 rounded-md transition duration-150 ease-in-out"
            disabled={isLoading}
          >
            Go to Dashboard
          </button>
          {/* <LogoutWrapper> */}
          <button
            onClick={handleLogout}
            className="w-full bg-gray-500 hover:bg-gray-300 text-white font-medium py-2 px-4 rounded-md transition duration-150 ease-in-out"
            disabled={isLoading}
          >
            Login as Different User
          </button>
          {/* </LogoutWrapper> */}
        </div>
      </div>
    </div>
  );
};

export default UnauthorizedPage;
