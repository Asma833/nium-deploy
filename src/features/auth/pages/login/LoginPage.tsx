import AuthLayout from '../../../../components/layout/AuthLayout';
import LoginForm from '../../components/LoginForm';
import { AuthRedirectGuard } from '@/core/routes/AuthRedirectGuard';

const LoginPage = () => {
  return (
    <AuthRedirectGuard>
      <AuthLayout title="Login">
        <LoginForm />
      </AuthLayout>
    </AuthRedirectGuard>
  );
};

export default LoginPage;
