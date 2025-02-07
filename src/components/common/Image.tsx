import { useState } from "react";
import { Img } from "react-image";

interface ImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  loading?: "lazy" | "eager";
}

const Image: React.FC<ImageProps> = ({ src, alt, ...props }) => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <Img
      src={src}
      alt={alt}
      loader={
        isLoading ? (
          <div
            className="animate-pulse bg-gray-200 rounded"
            style={{ width: props.width, height: props.height }}
          />
        ) : null
      }
      onLoad={() => setIsLoading(false)}
      {...props}
    />
  );
};

export default Image;
