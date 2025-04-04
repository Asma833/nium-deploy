import { useSelector } from 'react-redux';
import { RootState } from '@/store';

export const useCurrentUser = () => {
  const auth = useSelector((state: RootState) => state.auth);

  const getUserHashedKey = () => {
    return (
      auth.user?.id || auth.accessToken?.split('.')[1] || 'default-user-hash'
    );
  };

  return {
    getUserHashedKey,
    user: auth.user,
    isAuthenticated: !!auth.accessToken,
  };
};
