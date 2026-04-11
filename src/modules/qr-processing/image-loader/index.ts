import { fitImageSize, loadImage, readFileAsDataUrl } from '../../../utils/image';

export interface LoadedImage {
  src: string;
  image: HTMLImageElement;
  canvas: HTMLCanvasElement;
  imageData: ImageData;
}

export const loadProcessableImage = async (file: File): Promise<LoadedImage> => {
  const src = await readFileAsDataUrl(file);
  const image = await loadImage(src);
  const fitted = fitImageSize(image.width, image.height);
  const canvas = document.createElement('canvas');
  canvas.width = fitted.width;
  canvas.height = fitted.height;
  const context = canvas.getContext('2d');

  if (!context) {
    throw new Error('无法创建图片处理画布');
  }

  context.drawImage(image, 0, 0, fitted.width, fitted.height);
  const imageData = context.getImageData(0, 0, fitted.width, fitted.height);

  return { src, image, canvas, imageData };
};
