import AuthLayout from '../../../../components/layout/AuthLayout';
import ChangePasswordForm from '../../components/ChangePasswordForm';
import { AuthRedirectGuard } from '@/core/routes/AuthRedirectGuard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const ForgetPassword = () => {
  return (
    <AuthRedirectGuard>
      <AuthLayout>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Change Password</CardTitle>
          <CardDescription className="text-center">Enter your current password and create a new one</CardDescription>
        </CardHeader>
        <CardContent>
          <ChangePasswordForm />
        </CardContent>
      </AuthLayout>
    </AuthRedirectGuard>
  );
};

export default ForgetPassword;
