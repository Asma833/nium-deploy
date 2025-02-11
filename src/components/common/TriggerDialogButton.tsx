import { Button } from "../ui/button";
import { Download, Loader2, PlusIcon, UploadIcon } from "lucide-react";

type Props = {
  text: string;
  className?: string;
  iconType?: string;
  isLoading?: boolean;
};

export default function TriggerDialogButton({
  text,
  className,
  iconType = "default",
  isLoading = false,
}: Props) {
  const icon =
    iconType === "default" ? (
      <PlusIcon />
    ) : iconType === "upload" ? (
      <UploadIcon />
    ) : iconType === "download" ? (
      <Download />
    ) : null;



  return (
    <Button
      className={className}
      disabled={isLoading}
    >
      {isLoading ? <Loader2 className="animate-spin" /> : icon}
      {text}
    </Button>
  );
}
