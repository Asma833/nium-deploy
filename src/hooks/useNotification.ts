import { toast } from "sonner";

type NotificationProps = {
  message: string;
  description?: string;
};

export const useNotification = () => {
  const success = ({ message, description }: NotificationProps) => {
    toast.success(message, {
      description,
      duration: 4000,
    });
  };

  const error = ({ message, description }: NotificationProps) => {
    toast.error(message, {
      description,
      duration: 4000,
    });
  };

  const warning = ({ message, description }: NotificationProps) => {
    toast.warning(message, {
      description,
      duration: 4000,
    });
  };

  const info = ({ message, description }: NotificationProps) => {
    toast.info(message, {
      description,
      duration: 4000,
    });
  };

  return {
    success,
    error,
    warning,
    info,
  };
};

