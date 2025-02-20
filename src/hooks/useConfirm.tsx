import { useCallback } from "react";
import { useDialog } from "@/providers/dialog";
import { d } from "@/utils/dictionary";

type ConfirmOptions = {
  title?: string;
  message?: string;
  onConfirm: () => void;
  onCancel?: () => void;
};

export const useConfirm = () => {
  const { openDialog } = useDialog();

  return useCallback(
    async ({ title, message, onConfirm, onCancel }: ConfirmOptions) => {
      return openDialog({
        title: title ?? d.confirm,
        message: message ?? d.confirmAction,
        actions: [
          {
            label: d.cancel,
            onClick: onCancel,
          },
          {
            label: d.confirm,
            onClick: onConfirm,
            variant: "contained",
          },
        ],
      });
    },
    [openDialog]
  );
};
