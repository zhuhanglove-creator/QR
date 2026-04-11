export const loadImage = (src: string) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = src;
  });

export const readFileAsDataUrl = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

export const fitImageSize = (width: number, height: number, maxSide = 1600) => {
  const largest = Math.max(width, height);
  if (largest <= maxSide) {
    return { width, height };
  }

  const ratio = maxSide / largest;
  return {
    width: Math.round(width * ratio),
    height: Math.round(height * ratio),
  };
};
