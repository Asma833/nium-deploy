import AuthLayout from '../../../../components/layout/AuthLayout';
import SendEmailForm from '../../components/SendEmailForm';

const SendEmailPage = () => {
  return (
    <AuthLayout title="Send Reset Password Email">
      <SendEmailForm />
    </AuthLayout>
  );
};

export default SendEmailPage;
