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
  },
) => {
  const fileName = `${options?.fileName ?? exportConfig.fileName ?? 'qr-export'}.png`;
  const dataUrl = stage.toDataURL({
    pixelRatio: exportConfig.scale,
    mimeType: 'image/png',
    ...(options?.cropRect ?? {}),
  });

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
