import { useState, useEffect, useRef } from "react";
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
  const isMounted = useRef(false);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  const handleLoad = () => {
    if (isMounted.current) {
      setIsLoading(false);
    }
  };

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
      onLoad={handleLoad}
      {...props}
    />
  );
};

export default Image;
