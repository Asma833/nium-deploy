import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { ButtonProps } from '@/components/ui/button';
import { cn } from '@/utils/cn';

interface LoadingButtonProps extends Omit<ButtonProps, 'loading'> {
  loading?: boolean | undefined;
}

export function LoadingButton({ children, loading, disabled, className, ...props }: LoadingButtonProps) {
  return (
    <Button disabled={disabled || loading} className={cn(className)} {...props}>
      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {children}
    </Button>
  );
}
