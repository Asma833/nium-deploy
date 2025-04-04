import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AuthLayout from '../../components/AuthLayout';
import ChangePasswordForm from '../../components/ChangePasswordForm';
import { ROUTES } from '@/core/routes/routePaths';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import axios from 'axios';
import { Button } from '@/components/ui/button';

const ResetPasswordPage = () => {
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [tokenError, setTokenError] = useState<string | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Extract token from URL query parameters
    const params = new URLSearchParams(location.search);
    const tokenParam = params.get('token');

    if (!tokenParam) {
      setTokenError(
        'No reset token found. Please request a new password reset link.'
      );
      setLoading(false);
      return;
    }

    // Optionally verify token with your API
    const verifyToken = async () => {
      try {
        // You could add an API endpoint to verify the token
        // await axios.post(`${process.env.REACT_APP_API_URL}/users/verify-reset-token`, { token: tokenParam });

        // For now, just set the token
        setToken(tokenParam);
      } catch (error) {
        console.error('Token validation error:', error);

        let errorMessage =
          'Invalid or expired reset token. Please request a new password reset link.';
        if (axios.isAxiosError(error) && error.response) {
          errorMessage = error.response.data?.message || errorMessage;
        }

        setTokenError(errorMessage);
        toast({
          variant: 'destructive',
          title: 'Error',
          description: errorMessage,
        });
      } finally {
        setLoading(false);
      }
    };

    verifyToken();
  }, [location, navigate, toast]);

  const handleRequestNewLink = () => {
    navigate(ROUTES.AUTH.FORGET_PASSWORD);
  };

  return (
    <AuthLayout>
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">
          Reset Password
        </CardTitle>
        <CardDescription className="text-center">
          Create a new password for your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : tokenError ? (
          <div className="text-center space-y-4">
            <p className="text-destructive">{tokenError}</p>
            <Button onClick={handleRequestNewLink} className="mt-4">
              Request New Reset Link
            </Button>
          </div>
        ) : (
          token && <ChangePasswordForm token={token} isResetPassword={true} />
        )}
      </CardContent>
    </AuthLayout>
  );
};

export default ResetPasswordPage;
