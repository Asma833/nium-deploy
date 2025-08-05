import { lazy } from 'react';
import { ROUTES } from '../../constant/routePaths';

// prettier-ignore
const authComponents = {
  Login: lazy(() => import("@/features/auth/pages/login/LoginPage")),
  ResetPasswordPage: lazy(() => import("@/features/auth/pages/reset-password/ResetPasswordPage")),
  SendEmail: lazy(() => import("@/features/auth/pages/send-email/SendEmailPage")),
  ResetConfirmation: lazy(() => import("@/features/auth/pages/send-email/ResetLinkConfirmationAlert")),
  ResetPassword: lazy(() => import("@/features/auth/pages/reset-password/ResetPasswordPage"))
};

const baseRole = '*'; // Public routes are accessible to all roles

export const publicRoutes = [
  {
    path: ROUTES.AUTH.LOGIN,
    element: authComponents.Login,
    roles: [baseRole],
  },
  {
    path: ROUTES.AUTH.FORGET_PASSWORD,
    element: authComponents.ResetPasswordPage,
    roles: [baseRole],
  },
  {
    path: ROUTES.AUTH.SEND_PASSWORD_RESET,
    element: authComponents.SendEmail,
    roles: [baseRole],
  },
  {
    path: ROUTES.AUTH.RESET_LINK_CONFIRMATION,
    element: authComponents.ResetConfirmation,
    roles: [baseRole],
  },
  {
    path: ROUTES.AUTH.RESET_PASSWORD,
    element: authComponents.ResetPassword,
    roles: [baseRole],
  },
];
