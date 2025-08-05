import React from 'react';
import { Eye, History } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/utils/cn';
import { Button } from '@/components/ui/button';
interface ViewButtonProps {
  onClick: () => void;
  tooltipText: string;
  orderId?: string;
  disabled?: boolean;
  buttonType: 'view_details' | 'view_history';
  buttonIconType: 'view' | 'history';
  className?: string;
}

const ViewButton: React.FC<ViewButtonProps> = ({
  onClick,
  tooltipText,
  orderId,
  disabled = false,
  buttonType,
  buttonIconType,
  className,
}) => {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!disabled) {
      onClick();
    }
  };

  // Function to render the appropriate icon
  const renderIcon = () => {
    switch (buttonIconType) {
      case 'view':
        return <Eye size={16} />;
      case 'history':
        return <History size={16} />;
      default:
        return <Eye size={16} />;
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
          {renderIcon()}
        </Button>
      </TooltipTrigger>
      <TooltipContent className="bg-secondary text-foreground">{tooltipText}</TooltipContent>
    </Tooltip>
  );
};

export default ViewButton;
