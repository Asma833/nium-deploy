import { Img } from 'react-image';
import { Loader2 } from 'lucide-react';
import { cn } from '@/utils/cn';

interface ImageProps extends React.ComponentProps<typeof Img> {
  wrapperClassName?: string;
  loaderClassName?: string;
}

const Image = ({ wrapperClassName, loaderClassName, className, ...props }: ImageProps) => {
  return (
    <div className={cn('relative', wrapperClassName)}>
      <Img
        loader={
          <div className={cn('flex items-center justify-center w-full h-full', loaderClassName)}>
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        }
        unloader={
          <div className="flex items-center justify-center w-full h-full text-destructive">Failed to load image</div>
        }
        className={cn(className)}
        {...props}
      />
    </div>
  );
};

export { Image };
