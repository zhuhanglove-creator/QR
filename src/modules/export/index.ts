import Konva from 'konva';
import type { ExportConfig } from '../../types';

const isMobileDevice = () => {
  if (typeof navigator === 'undefined') {
    return false;
  }

  return /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);
};

const nextFrame = () =>
  new Promise<void>((resolve) => {
    requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
  });

const waitForFontsReady = async () => {
  if (typeof document === 'undefined' || !('fonts' in document)) {
    return;
  }

  try {
    await document.fonts.ready;
  } catch (error) {
    console.error('Failed while waiting for fonts', error);
  }
};

const waitForImageReady = (image: CanvasImageSource | null | undefined) =>
  new Promise<void>((resolve) => {
    if (!image || !(image instanceof HTMLImageElement)) {
      resolve();
      return;
    }

    if (image.complete && image.naturalWidth > 0) {
      resolve();
      return;
    }

    const finish = () => {
      image.removeEventListener('load', finish);
      image.removeEventListener('error', finish);
      resolve();
    };

    image.addEventListener('load', finish, { once: true });
    image.addEventListener('error', finish, { once: true });
  });

const waitForStageAssets = async (stage: Konva.Stage) => {
  await waitForFontsReady();

  const imageNodes = stage.find('Image') as Konva.Image[];
  await Promise.all(imageNodes.map((node) => waitForImageReady(node.image())));
  await nextFrame();
  stage.draw();
};

const createOffscreenContainer = () => {
  const container = document.createElement('div');
  container.style.position = 'fixed';
  container.style.left = '-100000px';
  container.style.top = '0';
  container.style.width = '1px';
  container.style.height = '1px';
  container.style.pointerEvents = 'none';
  container.style.opacity = '0';
  document.body.appendChild(container);
  return container;
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

const validateExportDimensions = async (dataUrl: string, expectedWidth: number, expectedHeight: number) => {
  const image = await dataUrlToImage(dataUrl);
  if (image.width !== expectedWidth || image.height !== expectedHeight) {
    throw new Error(`Export size mismatch: expected ${expectedWidth}x${expectedHeight}, got ${image.width}x${image.height}`);
  }
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

interface ExportFromNodeOptions {
  sourceNode: Konva.Node;
  width: number;
  height: number;
  fileName?: string;
  preferShareOnMobile?: boolean;
  backgroundColor?: string;
  resetPosition?: boolean;
  resetRotation?: boolean;
}

export const exportStageAsPng = async (
  stage: Konva.Stage,
  exportConfig: ExportConfig,
  options: ExportFromNodeOptions,
) => {
  await waitForStageAssets(stage);

  const container = createOffscreenContainer();
  const exportStage = new Konva.Stage({
    container,
    width: options.width,
    height: options.height,
  });

  try {
    const layer = new Konva.Layer();
    exportStage.add(layer);

    if (options.backgroundColor) {
      layer.add(
        new Konva.Rect({
          x: 0,
          y: 0,
          width: options.width,
          height: options.height,
          fill: options.backgroundColor,
        }),
      );
    }

    const clone = options.sourceNode.clone({
      x: options.resetPosition === false ? options.sourceNode.x() : 0,
      y: options.resetPosition === false ? options.sourceNode.y() : 0,
      scaleX: 1,
      scaleY: 1,
      rotation: options.resetRotation === false ? options.sourceNode.rotation() : 0,
    });

    layer.add(clone);
    await waitForStageAssets(exportStage);

    const dataUrl = exportStage.toDataURL({
      pixelRatio: exportConfig.scale,
      mimeType: 'image/png',
      x: 0,
      y: 0,
      width: options.width,
      height: options.height,
    });

    const expectedWidth = Math.round(options.width * exportConfig.scale);
    const expectedHeight = Math.round(options.height * exportConfig.scale);
    await validateExportDimensions(dataUrl, expectedWidth, expectedHeight);

    const blob = await dataUrlToBlob(dataUrl);
    const fileName = `${options.fileName ?? exportConfig.fileName ?? 'qr-export'}.png`;

    if (options.preferShareOnMobile !== false && isMobileDevice()) {
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
  } finally {
    exportStage.destroy();
    container.remove();
  }
};
