import AuthLayout from '../../../../components/layout/AuthLayout';
import SendEmailForm from '../../components/SendEmailForm';
import { AuthRedirectGuard } from '@/core/routes/AuthRedirectGuard';

const SendEmailPage = () => {
  return (
    <AuthRedirectGuard>
      <AuthLayout title="Send Reset Email">
        <SendEmailForm />
      </AuthLayout>
    </AuthRedirectGuard>
  );
};

export default SendEmailPage;
