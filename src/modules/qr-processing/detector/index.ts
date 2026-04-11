import jsQR from 'jsqr';
import type { Point, Rect } from '../../../types';
import { pointsToBoundingBox } from '../../../utils/qr';
import type { LoadedImage } from '../image-loader';

export interface DetectionResult {
  decodedText?: string;
  cornerPoints?: Point[];
  boundingBox?: Rect;
  confidence: number;
}

export const detectQrInImage = async (loadedImage: LoadedImage): Promise<DetectionResult> => {
  const result = jsQR(loadedImage.imageData.data, loadedImage.imageData.width, loadedImage.imageData.height, {
    inversionAttempts: 'attemptBoth',
  });

  if (!result) {
    return { confidence: 0 };
  }

  const cornerPoints = [
    result.location.topLeftCorner,
    result.location.topRightCorner,
    result.location.bottomRightCorner,
    result.location.bottomLeftCorner,
  ].map((point) => ({ x: point.x, y: point.y }));

  return {
    decodedText: result.data,
    cornerPoints,
    boundingBox: pointsToBoundingBox(cornerPoints),
    confidence: 0.92,
  };
};
