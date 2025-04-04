import React from 'react';
import { LinkIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { copyToClipboard } from '@/utils/clipboard';
import { cn } from '@/utils/cn';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface SignLinkButtonProps {
  copyLinkUrl: string;
  buttonText: string;
  disabled?: boolean;
  className?: string;
  tooltipText?: string;
}

export const SignLinkButton: React.FC<SignLinkButtonProps> = ({
  copyLinkUrl,
  buttonText,
  disabled,
  className,
  tooltipText,
}) => {
  const handleCopyLink = () => {
    copyToClipboard(copyLinkUrl, `${buttonText} link copied successfully!`);
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          onClick={handleCopyLink}
          variant="outline"
          size="sm"
          disabled={disabled}
          className={cn(
            'text-gray-500  hover:bg-black hover:text-white disabled:bg-gray-200 disabled:text-gray-500 ',
            className
          )}
        >
          <LinkIcon className="cursor-pointer" />
        </Button>
      </TooltipTrigger>
      <TooltipContent className="bg-gray-400">{tooltipText}</TooltipContent>
    </Tooltip>
  );
};
