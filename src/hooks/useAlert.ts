import { useState } from 'react';

interface AlertConfig {
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
}

export const useAlert = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [config, setConfig] = useState<AlertConfig | null>(null);

  const showAlert = (alertConfig: AlertConfig) => {
    setConfig(alertConfig);
    setIsOpen(true);
  };

  const handleConfirm = () => {
    config?.onConfirm?.();
    setIsOpen(false);
  };

  const handleCancel = () => {
    config?.onCancel?.();
    setIsOpen(false);
  };

  return {
    isOpen,
    showAlert,
    handleConfirm,
    handleCancel,
    title: config?.title,
    description: config?.description,
    confirmText: config?.confirmText ?? 'Continue',
    cancelText: config?.cancelText ?? 'Cancel',
  };
};
