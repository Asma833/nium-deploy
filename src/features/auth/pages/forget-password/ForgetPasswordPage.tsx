import AuthLayout from "../../components/AuthLayout";
import ChangePasswordForm from "../../components/ChangePasswordForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const ForgetPassword = () => {
  return(
    <AuthLayout >
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Change Password</CardTitle>
          <CardDescription className="text-center">
            Enter your current password and create a new one
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChangePasswordForm />
        </CardContent>
    </AuthLayout>
  );
};

export default ForgetPassword;
