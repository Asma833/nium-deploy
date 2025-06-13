import { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/utils/cn';

interface TooltipActionButtonProps {
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  icon: ReactNode;
  tooltipText: string;
  disabled?: boolean;
  variant?: 'edit' | 'view' | 'delete' | 'upload' | 'default';
  size?: 'sm' | 'default' | 'lg';
  className?: string;
}

const TooltipActionButton = ({
  onClick,
  icon,
  tooltipText,
  disabled = false,
  variant = 'default',
  size = 'sm',
  className,
}: TooltipActionButtonProps) => {
  const getVariantClasses = () => {
    const baseClasses = 'text-foreground bg-transparent border-none shadow-none disabled:text-gray-500';

    switch (variant) {
      case 'edit':
        return cn(baseClasses, 'hover:bg-primary hover:text-white');
      case 'view':
        return cn(baseClasses, 'hover:bg-primary hover:text-white');
      case 'delete':
        return cn(baseClasses, 'hover:bg-destructive hover:text-white');
      case 'upload':
        return cn(baseClasses, 'hover:bg-primary hover:text-white');
      default:
        return cn(baseClasses, 'hover:bg-primary hover:text-white');
    }
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          onClick={(e) => {
            e.stopPropagation();
            onClick(e);
          }}
          variant="outline"
          size={size}
          disabled={disabled}
          className={cn(getVariantClasses(), className)}
        >
          {icon}
        </Button>
      </TooltipTrigger>
      <TooltipContent className="bg-secondary text-foreground">{tooltipText}</TooltipContent>
    </Tooltip>
  );
};

export default TooltipActionButton;
