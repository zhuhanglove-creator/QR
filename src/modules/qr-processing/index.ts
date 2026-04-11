import { nanoid } from 'nanoid';
import type { AssetLibraryItem, QrProcessingResult, QrStyleConfig } from '../../types';
import { analyzeQrMatrix } from './analyzer';
import { detectQrInImage } from './detector';
import { loadProcessableImage } from './image-loader';
import { rectifyQrRegion } from './rectifier';
import { renderQrDataUrl } from './renderer';
import { validateRenderedQr } from './validator';

export const processQrAsset = async (file: File, style: QrStyleConfig): Promise<{ asset: AssetLibraryItem; result: QrProcessingResult }> => {
  const loadedImage = await loadProcessableImage(file);
  const detection = await detectQrInImage(loadedImage);
  const rectified = rectifyQrRegion(loadedImage, detection.boundingBox);
  const analysis = analyzeQrMatrix(rectified.correctedCanvas, detection.decodedText);
  const previewUrl = renderQrDataUrl(analysis.matrix, style, 768);
  const validation = await validateRenderedQr(previewUrl, style);

  const asset: AssetLibraryItem = {
    id: nanoid(),
    name: file.name,
    kind: 'qr',
    mimeType: file.type,
    src: loadedImage.src,
    width: loadedImage.canvas.width,
    height: loadedImage.canvas.height,
    createdAt: new Date().toISOString(),
  };

  return {
    asset,
    result: {
      success: true,
      sourceAssetId: asset.id,
      boundingBox: detection.boundingBox,
      cornerPoints: detection.cornerPoints,
      decodedText: detection.decodedText,
      correctedImageSrc: rectified.correctedImageSrc,
      binaryImageSrc: rectified.correctedImageSrc,
      moduleMatrix: analysis.matrix,
      gridSize: analysis.gridSize,
      analysisMode: analysis.mode,
      confidence: detection.confidence,
      warnings: detection.decodedText ? [] : ['未成功解码原始二维码，当前为近似结构化重绘模式。'],
      validation,
    },
  };
};
