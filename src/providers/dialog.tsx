import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { createContext, useCallback, useContext, useState } from "react";

type DialogAction = {
  label: string;
  onClick?: () => void;
  variant?: "text" | "contained" | "outlined";
};

type DialogOptions = {
  title: string;
  message: string;
  actions: DialogAction[];
};

export type DialogContextType = {
  openDialog: (options: DialogOptions) => void;
};

export const DialogContext = createContext<DialogContextType | null>(null);

export const DialogProvider = ({ children }: { children: React.ReactNode }) => {
  const [dialog, setDialog] = useState<DialogOptions | null>(null);

  const openDialog = useCallback((options: DialogOptions) => {
    setDialog(options);
  }, []);

  const closeDialog = useCallback(() => {
    setDialog(null);
  }, []);

  return (
    <DialogContext.Provider value={{ openDialog }}>
      {children}
      <Dialog open={!!dialog} onClose={closeDialog}>
        {dialog && (
          <>
            <DialogTitle>{dialog.title}</DialogTitle>
            <DialogContent>{dialog.message}</DialogContent>
            <DialogActions>
              {dialog.actions.map((action, index) => (
                <Button
                  key={index}
                  onClick={() => {
                    action.onClick?.();
                    closeDialog();
                  }}
                  variant={action.variant || "text"}
                >
                  {action.label}
                </Button>
              ))}
            </DialogActions>
          </>
        )}
      </Dialog>
    </DialogContext.Provider>
  );
};

// export const useDialog = () => {
//   const context = useContext(DialogContext);
//   if (!context) {
//     throw new Error("useDialog must be used within DialogProvider");
//   }
//   return context;
// };
