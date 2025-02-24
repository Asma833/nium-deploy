import { useMutation } from '@tanstack/react-query';
import { authApi } from '../api/authApi';
import { useNavigate } from 'react-router-dom';
import { toast } from "sonner";


export const useForgotPassword = () => { 
  const navigate = useNavigate();
 
  const { mutate, isPending, error } = useMutation({
    mutationFn: authApi.forgotPassword,
    onSuccess: () => {
      navigate('/forget-password')
      toast.success('Password reset email sent successfully')
      // Handle successful password reset request
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Sending email failed');
    }
  });
  
  return { mutate, isLoading: isPending, error };
};