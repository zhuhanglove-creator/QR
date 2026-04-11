import qrcode from 'qrcode-generator';
import { clampOddQrSize } from '../../../utils/qr';

const matrixFromGeneratedQr = (value: string) => {
  const generator = qrcode(0, 'M');
  generator.addData(value);
  generator.make();
  const size = generator.getModuleCount();

  return Array.from({ length: size }, (_, row) =>
    Array.from({ length: size }, (_, column) => generator.isDark(row, column)),
  );
};

const estimateGridSize = (canvas: HTMLCanvasElement) => {
  const context = canvas.getContext('2d');
  if (!context) {
    return 29;
  }

  const { width, height } = canvas;
  const row = context.getImageData(0, Math.floor(height / 2), width, 1).data;
  let transitions = 0;
  let last = row[0] < 128 ? 1 : 0;
  for (let index = 4; index < row.length; index += 4) {
    const next = row[index] < 128 ? 1 : 0;
    if (next !== last) {
      transitions += 1;
      last = next;
    }
  }

  return clampOddQrSize(Math.max(21, Math.round(transitions / 2)));
};

const matrixFromCanvas = (canvas: HTMLCanvasElement, gridSize: number) => {
  const context = canvas.getContext('2d');
  if (!context) {
    return [];
  }

  const cellSize = canvas.width / gridSize;
  return Array.from({ length: gridSize }, (_, row) =>
    Array.from({ length: gridSize }, (_, column) => {
      const sample = context.getImageData(
        Math.min(canvas.width - 1, Math.floor(column * cellSize + cellSize / 2)),
        Math.min(canvas.height - 1, Math.floor(row * cellSize + cellSize / 2)),
        1,
        1,
      ).data;
      return sample[0] < 128;
    }),
  );
};

export const analyzeQrMatrix = (correctedCanvas: HTMLCanvasElement, decodedText?: string) => {
  if (decodedText) {
    const matrix = matrixFromGeneratedQr(decodedText);
    return {
      matrix,
      gridSize: matrix.length,
      mode: 'exact' as const,
    };
  }

  const gridSize = estimateGridSize(correctedCanvas);
  return {
    matrix: matrixFromCanvas(correctedCanvas, gridSize),
    gridSize,
    mode: 'fallback' as const,
  };
};
