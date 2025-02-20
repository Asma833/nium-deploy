import { DialogContext } from "@/providers/dialog";
import { useContext } from "react";

export const useDialog = () => {
    const context = useContext(DialogContext);
    if (!context) {
      throw new Error("useDialog must be used within DialogProvider");
    }
    return context;
  };
  