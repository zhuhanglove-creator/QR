import type Konva from 'konva';
import type { ExportConfig, Rect } from '../../types';

export const exportStageAsPng = (
  stage: Konva.Stage,
  exportConfig: ExportConfig,
  options?: {
    cropRect?: Rect;
    fileName?: string;
  },
) => {
  const dataUrl = stage.toDataURL({
    pixelRatio: exportConfig.scale,
    mimeType: 'image/png',
    ...(options?.cropRect ?? {}),
  });
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = `${options?.fileName ?? exportConfig.fileName ?? 'qr-export'}.png`;
  link.click();
};
