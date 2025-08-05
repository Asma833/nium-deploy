import React from 'react';
import { Delete, Edit, Eye, LinkIcon, Plus, RefreshCw, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { copyToClipboard } from '@/utils/clipboard';
import { cn } from '@/utils/cn';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface SignLinkButtonProps {
  id?: string;
  copyLinkUrl?: string;
  buttonText?: string;
  toastInfoText?: string;
  disabled?: boolean;
  className?: string;
  tooltipText?: string;
  buttonType?: 'button' | 'copy_link' | 'refresh' | 'remove' | 'delete' | 'edit' | 'view' | 'add';
  buttonIconType?: 'button' | 'copy_link' | 'refresh' | 'remove' | 'delete' | 'edit' | 'view' | 'add';
  onClick?: () => void;
  loading?: string | boolean;
}

export const SignLinkButton: React.FC<SignLinkButtonProps> = ({
  id,
  copyLinkUrl,
  toastInfoText,
  disabled,
  className,
  tooltipText,
  buttonType,
  buttonIconType,
  onClick,
  loading,
}) => {
  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      if (buttonType === 'copy_link' && copyLinkUrl) {
        copyToClipboard(copyLinkUrl, `${toastInfoText}`);
      }
    }
  };

  const getIcon = () => {
    switch (buttonIconType) {
      case 'copy_link':
        return <LinkIcon className="cursor-pointer" />;
      case 'refresh':
        return (
          <RefreshCw
            className={cn(
              'cursor-pointer text-inherit',
              loading ? 'animate-spin' : '',
              disabled ? 'text-gray-500' : ''
            )}
          />
        );
      case 'remove':
        return <X className="cursor-pointer" />;
      case 'delete':
        return <Delete className="cursor-pointer" />;
      case 'edit':
        return <Edit className="cursor-pointer" />;
      case 'view':
        return <Eye className="cursor-pointer" />;
      case 'add':
        return <Plus className="cursor-pointer" />;
      default:
        return null;
    }
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          onClick={handleClick}
          variant="outline"
          size="sm"
          disabled={disabled}
          className={cn(
            'text-foreground  bg-transparent border-none shadow-none',
            className,
            'hover:bg-primary hover:text-white  disabled:text-gray-500'
          )}
        >
          {getIcon()}
        </Button>
      </TooltipTrigger>
      <TooltipContent className="bg-secondary text-foreground">{tooltipText}</TooltipContent>
    </Tooltip>
  );
};
