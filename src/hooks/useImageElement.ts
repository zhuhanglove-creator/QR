import { useEffect, useState } from 'react';
import { loadImage } from '../utils/image';

export const useImageElement = (src?: string) => {
  const [image, setImage] = useState<HTMLImageElement>();

  useEffect(() => {
    if (!src) {
      setImage(undefined);
      return;
    }

    let active = true;
    loadImage(src)
      .then((loaded) => {
        if (active) {
          setImage(loaded);
        }
      })
      .catch(() => {
        if (active) {
          setImage(undefined);
        }
      });

    return () => {
      active = false;
    };
  }, [src]);

  return image;
};
