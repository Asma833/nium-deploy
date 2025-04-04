import { lazy } from 'react';
import { ROUTES } from '../routePaths';

// prettier-ignore
const authComponents = {
  Login: lazy(() => import("@/features/auth/pages/login/LoginPage")),
  ResetPasswordPage: lazy(() => import("@/features/auth/pages/reset-password/ResetPasswordPage")),
  SendEmail: lazy(() => import("@/features/auth/pages/send-email/SendEmailPage")),
  ResetConfirmation: lazy(() => import("@/features/auth/pages/send-email/ResetLinkConfirmationAlert")),
  ResetPassword: lazy(() => import("@/features/auth/pages/reset-password/ResetPasswordPage"))
};

export const publicRoutes = [
  {
    path: ROUTES.AUTH.LOGIN,
    element: authComponents.Login,
    roles: ['*'],
  },
  {
    path: ROUTES.AUTH.FORGET_PASSWORD,
    element: authComponents.ResetPasswordPage,
    roles: ['*'],
  },
  {
    path: ROUTES.AUTH.SEND_PASSWORD_RESET,
    element: authComponents.SendEmail,
    roles: ['*'],
  },
  {
    path: ROUTES.AUTH.RESET_LINK_CONFIRMATION,
    element: authComponents.ResetConfirmation,
    roles: ['*'],
  },
  {
    path: ROUTES.AUTH.RESET_PASSWORD,
    element: authComponents.ResetPassword,
    roles: ['*'],
  },
];
