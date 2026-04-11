import type { Rect } from '../../../types';
import type { LoadedImage } from '../image-loader';

export interface RectifyOptions {
  manualPadding?: number;
}

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

export const rectifyQrRegion = (loadedImage: LoadedImage, box?: Rect, options?: RectifyOptions) => {
  const padding = options?.manualPadding ?? 0.12;
  const sourceBox = box ?? {
    x: 0,
    y: 0,
    width: loadedImage.canvas.width,
    height: loadedImage.canvas.height,
  };
  const maxSide = Math.max(sourceBox.width, sourceBox.height);
  const paddedBox = {
    x: clamp(sourceBox.x - maxSide * padding, 0, loadedImage.canvas.width),
    y: clamp(sourceBox.y - maxSide * padding, 0, loadedImage.canvas.height),
    width: clamp(sourceBox.width + maxSide * padding * 2, 1, loadedImage.canvas.width),
    height: clamp(sourceBox.height + maxSide * padding * 2, 1, loadedImage.canvas.height),
  };
  const normalizedSize = 512;
  const canvas = document.createElement('canvas');
  canvas.width = normalizedSize;
  canvas.height = normalizedSize;
  const context = canvas.getContext('2d');

  if (!context) {
    throw new Error('无法创建二维码裁剪画布');
  }

  context.fillStyle = '#ffffff';
  context.fillRect(0, 0, normalizedSize, normalizedSize);
  context.drawImage(
    loadedImage.canvas,
    paddedBox.x,
    paddedBox.y,
    Math.min(paddedBox.width, loadedImage.canvas.width - paddedBox.x),
    Math.min(paddedBox.height, loadedImage.canvas.height - paddedBox.y),
    0,
    0,
    normalizedSize,
    normalizedSize,
  );

  const imageData = context.getImageData(0, 0, normalizedSize, normalizedSize);
  const pixels = imageData.data;
  let total = 0;
  for (let index = 0; index < pixels.length; index += 4) {
    const gray = 0.299 * pixels[index] + 0.587 * pixels[index + 1] + 0.114 * pixels[index + 2];
    total += gray;
  }
  const threshold = total / (pixels.length / 4);

  for (let index = 0; index < pixels.length; index += 4) {
    const gray = 0.299 * pixels[index] + 0.587 * pixels[index + 1] + 0.114 * pixels[index + 2];
    const value = gray < threshold ? 0 : 255;
    pixels[index] = value;
    pixels[index + 1] = value;
    pixels[index + 2] = value;
    pixels[index + 3] = 255;
  }

  context.putImageData(imageData, 0, 0);

  return {
    correctedCanvas: canvas,
    correctedImageSrc: canvas.toDataURL('image/png'),
  };
};
