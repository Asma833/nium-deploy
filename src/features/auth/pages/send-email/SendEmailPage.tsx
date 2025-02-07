import AuthLayout from "../../components/AuthLayout";
import SendEmailForm from "../../components/SendEmailForm";

const SendEmailPage = () => {
  return (
    <AuthLayout title="Send Reset Email">
      <SendEmailForm />
    </AuthLayout>
  );
};

export default SendEmailPage;
