import { useState } from 'react';
import { ImageProps } from '../types/common-components.types';

const Image: React.FC<ImageProps> = ({
  src,
  alt,
  width,
  height,
  className,
  ...props
}) => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="relative">
      {isLoading && (
        <div
          className="absolute animate-pulse bg-gray-200 rounded"
          style={{ width, height }}
        />
      )}
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={className}
        onLoad={() => setIsLoading(false)}
        {...props}
      />
    </div>
  );
};

export default Image;
