import { Button } from '../ui/button';
import { Download, Loader2, PlusIcon, UploadIcon } from 'lucide-react';
import { TriggerDialogButtonProps } from '../types/common-components.types';

export default function TriggerDialogButton({
  text,
  className,
  iconType = 'default',
  isLoading = false,
}: TriggerDialogButtonProps) {
  const icon =
    iconType === 'default' ? (
      <PlusIcon />
    ) : iconType === 'upload' ? (
      <UploadIcon />
    ) : iconType === 'download' ? (
      <Download />
    ) : null;

  return (
    <Button className={className} disabled={isLoading}>
      {isLoading ? <Loader2 className="animate-spin" /> : icon}
      {text}
    </Button>
  );
}
