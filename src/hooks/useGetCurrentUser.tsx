import { useSelector } from 'react-redux';

interface User {
  id?: string;
  email?: string;
  fullName?: string;
  rights?: any[];
  newUser?: boolean;
  role?: {
    name?: string;
  };
}

interface RootState {
  auth: {
    user: User;
    isAuthenticated: boolean;
    isLoading: boolean;
  };
}

const useGetCurrentUser = () => {
  const user = useSelector((state: RootState) => state.auth.user);

  return {
    role: user?.role?.name,
    userName: user?.fullName,
    userEmail: user?.email,
    userId: user?.id,
  };
};

export default useGetCurrentUser;
