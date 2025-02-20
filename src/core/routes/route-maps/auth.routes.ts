import { lazy } from 'react';
import { ROUTES } from '../constants';

// prettier-ignore
const authComponents = {
  Login: lazy(() => import("@/features/auth/pages/login/LoginPage")),
  ForgetPassword: lazy(() => import("@/features/auth/pages/forget-password/ForgetPasswordPage")),
  SendEmail: lazy(() => import("@/features/auth/pages/send-email/SendEmailPage")),
  ResetConfirmation: lazy(() => import("@/features/auth/pages/send-email/ResetLinkConfirmationAlert"))
};

export const publicRoutes = [
  {
    path: ROUTES.AUTH.LOGIN,
    element: authComponents.Login,
    roles: ["*"]
  },
  {
    path: ROUTES.AUTH.FORGET_PASSWORD,
    element: authComponents.ForgetPassword,
    roles: ["*"]
  },
  {
    path: ROUTES.AUTH.SEND_PASSWORD_RESET,
    element: authComponents.SendEmail,
    roles: ["*"]
  },
  {
    path: ROUTES.AUTH.RESET_LINK_CONFIRMATION,
    element: authComponents.ResetConfirmation,
    roles: ["*"]
  }
];
