import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/utils/cn";
import { Download, Loader2, PlusIcon, UploadIcon } from "lucide-react";
import { DialogWrapperProps } from './common-components.types';

type IconType = "default" | "upload" | "download";

export function DialogWrapper({
  triggerBtnText,
  renderContent,
  title = "Edit Profile",
  description,
  showFooter = true,
  showHeader = true,
  isLoading,
  iconType = "default",
  triggerBtnClassName,
  className,
  onSave,
  footerBtnText,
}: DialogWrapperProps) {
  const getIcon = (type: IconType) => {
    const icons = {
      default: <PlusIcon />,
      upload: <UploadIcon />,
      download: <Download />,
    };
    return icons[type];
  };

  const icon = getIcon(iconType);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className={triggerBtnClassName} disabled={isLoading}>
          {isLoading ? <Loader2 className="animate-spin" /> : icon}
          {triggerBtnText}
        </Button>
      </DialogTrigger>
      <DialogContent className={cn("max-w-sm sm:max-w-md", className)}>
        {showHeader && (
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            {description && (
              <DialogDescription>{description}</DialogDescription>
            )}
          </DialogHeader>
        )}

        {renderContent}

        {showFooter && (
          <DialogFooter>
            <Button onClick={onSave} disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="animate-spin" />
              ) : (
                footerBtnText || "Save"
              )}
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
