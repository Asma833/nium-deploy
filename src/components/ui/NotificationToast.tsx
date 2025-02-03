import { Toaster } from 'sonner';

/**
 * Renders a notification toast using the Toaster component.
 *
 * @remarks
 * This component displays a toaster notification in the top-right corner with a light theme.
 * It supports rich colors and includes a close button. The notification toast is intended for
 * brief, non-intrusive messages or alerts.
 *
 * @example
 * // Import and use the NotificationToast component in your application:
 * import { NotificationToast } from './NotificationToast';
 * 
 * function App() {
 *   return (
 *     <div>
 *       <NotificationToast />
 *     </div>
 *   );
 * }
 *
 * @returns A React component that renders a toaster for notifications.
 */
export const NotificationToast = () => {
  return (
    <Toaster
      position="top-right"
      expand={false}
      richColors
      closeButton
      theme="light"
    />
  );
};
