import type Konva from 'konva';
import type { ExportConfig, Rect } from '../../types';

const isMobileDevice = () => {
  if (typeof navigator === 'undefined') {
    return false;
  }

  return /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);
};

const dataUrlToBlob = async (dataUrl: string) => {
  const response = await fetch(dataUrl);
  return response.blob();
};

const dataUrlToImage = (dataUrl: string) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error('Failed to load export image'));
    image.src = dataUrl;
  });

const renderExportSurface = async (
  dataUrl: string,
  width: number,
  height: number,
  backgroundColor: string,
) => {
  const image = await dataUrlToImage(dataUrl);
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext('2d');

  if (!context) {
    throw new Error('Failed to create export canvas');
  }

  context.fillStyle = backgroundColor;
  context.fillRect(0, 0, width, height);
  context.drawImage(image, 0, 0, width, height);

  return canvas.toDataURL('image/png');
};

const downloadBlob = (blob: Blob, fileName: string) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  link.rel = 'noopener';
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
};

const shareBlob = async (blob: Blob, fileName: string) => {
  const extension = fileName.toLowerCase().endsWith('.png') ? '' : '.png';
  const file = new File([blob], `${fileName}${extension}`, { type: 'image/png' });

  if (
    typeof navigator !== 'undefined' &&
    'share' in navigator &&
    'canShare' in navigator &&
    navigator.canShare({ files: [file] })
  ) {
    await navigator.share({
      files: [file],
      title: file.name,
    });
    return true;
  }

  return false;
};

export const expandCropRect = (rect: Rect, padding: number, stageWidth: number, stageHeight: number): Rect => {
  const x = Math.max(0, rect.x - padding);
  const y = Math.max(0, rect.y - padding);
  const maxWidth = stageWidth - x;
  const maxHeight = stageHeight - y;

  return {
    x,
    y,
    width: Math.min(rect.width + padding * 2, maxWidth),
    height: Math.min(rect.height + padding * 2, maxHeight),
  };
};

export const exportStageAsPng = async (
  stage: Konva.Stage,
  exportConfig: ExportConfig,
  options?: {
    cropRect?: Rect;
    fileName?: string;
    preferShareOnMobile?: boolean;
    backgroundColor?: string;
  },
) => {
  const fileName = `${options?.fileName ?? exportConfig.fileName ?? 'qr-export'}.png`;
  const cropRect = options?.cropRect;
  const width = Math.round((cropRect?.width ?? stage.width()) * exportConfig.scale);
  const height = Math.round((cropRect?.height ?? stage.height()) * exportConfig.scale);
  const rawDataUrl = stage.toDataURL({
    pixelRatio: exportConfig.scale,
    mimeType: 'image/png',
    ...(cropRect ?? {}),
  });
  const dataUrl = await renderExportSurface(rawDataUrl, width, height, options?.backgroundColor ?? '#ffffff');

  const blob = await dataUrlToBlob(dataUrl);

  if (options?.preferShareOnMobile !== false && isMobileDevice()) {
    try {
      const shared = await shareBlob(blob, fileName.replace(/\.png$/i, ''));
      if (shared) {
        return;
      }
    } catch (error) {
      if (!(error instanceof DOMException && error.name === 'AbortError')) {
        console.error('Failed to share export', error);
      } else {
        return;
      }
    }
  }

  downloadBlob(blob, fileName);
};
