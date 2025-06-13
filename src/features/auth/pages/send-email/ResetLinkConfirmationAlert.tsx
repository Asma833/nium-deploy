import { CircleCheckBigIcon } from 'lucide-react';
import AuthLayout from '../../../../components/layout/AuthLayout';
import { Link } from 'react-router';

const ResetLinkConfirmationAlert = () => {
  return (
    <AuthLayout>
      <div>
        <div className="">
          <h1 className="font-medium text-2xl flex items-start  gap-3">
            <CircleCheckBigIcon className="w-16 h-16 text-green-500" />
            <span>Reset Password Link Sent Successfully</span>
          </h1>
          <p className="text-gray-500 mt-2">
            A password reset link has been sent to your email address. Please check your inbox and follow the
            instructions.{'  '}
            <Link to="/login" className="text-primary underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </AuthLayout>
  );
};

export default ResetLinkConfirmationAlert;
