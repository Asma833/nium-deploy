import * as React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

export interface DeleteConfirmationDialogProps {
  open: boolean;
  onOpenChange?: (open: boolean) => void;
  title?: string;
  message?: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  loading?: boolean;
  // New enhanced props
  partnerOrderId?: string;
  onDeleteSuccess?: () => void;
  onDeleteError?: (error: any) => void;
  isSubmitting?: boolean;
}

const DeleteConfirmationDialog: React.FC<DeleteConfirmationDialogProps> = ({
  open,
  onOpenChange,
  title = 'Delete Confirmation',
  message = 'Are you sure you want to delete this item? This action cannot be undone.',
  confirmText = 'Delete',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  loading = false,
  // New enhanced props
  partnerOrderId,
  onDeleteSuccess,
  onDeleteError,
  isSubmitting = false,
}) => {
  const handleOpenChange = (open: boolean) => {
    if (onOpenChange) {
      onOpenChange(open);
    } else if (!open && onCancel) {
      onCancel();
    }
  };

  const handleConfirm = async () => {
    if (onConfirm) {
      try {
        await onConfirm();
        if (onDeleteSuccess) {
          onDeleteSuccess();
        }
      } catch (error) {
        if (onDeleteError) {
          onDeleteError(error);
        }
      }
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
  };

  // Use isSubmitting if provided, otherwise fall back to loading
  const isLoading = isSubmitting || loading;

  // Enhanced message with partnerOrderId if provided
  const displayMessage = partnerOrderId
    ? `Are you sure you want to delete transaction "${partnerOrderId}"? This action cannot be undone.`
    : message;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{displayMessage}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={handleCancel} disabled={isLoading}>
            {cancelText}
          </Button>
          <Button variant="destructive" onClick={handleConfirm} disabled={isLoading}>
            {confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteConfirmationDialog;
