import { useSelector } from 'react-redux';
import { RootState } from '@/store';

export const useCurrentUser = () => {
  const auth = useSelector((state: RootState) => state.auth);
  
  const getUserHashedKey = () => {
    // This would typically come from your auth state in Redux
    // For now, return the user id or a placeholder
    return auth.user?.id || auth.accessToken?.split('.')[1] || 'default-user-hash';
  };
  
  return {
    getUserHashedKey,
    user: auth.user,
    isAuthenticated: !!auth.accessToken,
  };
};
