import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./alert-dialog";

interface ConfirmationAlertProps {
  children: React.ReactNode;
  title: string;
  description: string;
  onConfirm: () => void;
  isLoading?: boolean;
}

export function ConfirmationAlert({
  children,
  title,
  description,
  onConfirm,
  isLoading = false,
}: ConfirmationAlertProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent className="bg-white border-none">
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
            onClick={onConfirm}
            disabled={isLoading}
            >
            {isLoading ? "Loading..." : "Continue"}
            </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
