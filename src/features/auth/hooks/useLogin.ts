import { useMutation } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { authApi } from "../api/authApi";
import { setCredentials } from "../store/authSlice";
import { DEFAULT_ROUTES } from "../../../core/constant/routes";
import { toast } from "sonner";
import { LoginResponse  } from "../types/auth.types";
import type { LoginCredentials } from "../api/authApi"; // Add this import

export const useLogin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { mutate, isPending, error } = useMutation<
    LoginResponse,
    Error,
    LoginCredentials
  >({
    mutationFn: authApi.loginUser,
    onSuccess: (data) => {
  
      dispatch(setCredentials({ 
        user: data.user, 
        accessToken: data.access_token 
      }));
      
      const defaultRoute = DEFAULT_ROUTES[data.user.role.name];
      if (defaultRoute) {
        toast.success('Login successful');
        navigate(defaultRoute);
      } else {
        toast.error('Invalid user role');
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Login failed');
    }
  });

  return { mutate, isLoading: isPending, error };
};
