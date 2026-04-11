import type { QrStyleConfig } from '../../../types';

const withAlpha = (hex: string, alpha: number) => {
  const normalized = hex.replace('#', '');
  return `#${normalized}${Math.round(alpha * 255)
    .toString(16)
    .padStart(2, '0')}`;
};

const drawRoundedRect = (context: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number) => {
  context.beginPath();
  context.moveTo(x + radius, y);
  context.arcTo(x + width, y, x + width, y + height, radius);
  context.arcTo(x + width, y + height, x, y + height, radius);
  context.arcTo(x, y + height, x, y, radius);
  context.arcTo(x, y, x + width, y, radius);
  context.closePath();
};

const drawFinder = (context: CanvasRenderingContext2D, x: number, y: number, size: number, style: QrStyleConfig) => {
  const radius = style.finderStyle === 'rounded' ? size * 0.22 : 0;
  const ring = style.finderStyle === 'ring';

  context.save();
  context.fillStyle = style.fgColor;
  context.strokeStyle = style.fgColor;
  context.lineWidth = size * 0.12;

  if (ring) {
    drawRoundedRect(context, x, y, size, size, size * 0.26);
    context.stroke();
    drawRoundedRect(context, x + size * 0.3, y + size * 0.3, size * 0.4, size * 0.4, size * 0.12);
    context.fill();
  } else {
    drawRoundedRect(context, x, y, size, size, radius);
    context.fill();
    context.fillStyle = style.bgColor;
    drawRoundedRect(context, x + size * 0.18, y + size * 0.18, size * 0.64, size * 0.64, radius * 0.7);
    context.fill();
    context.fillStyle = style.fgColor;
    drawRoundedRect(context, x + size * 0.34, y + size * 0.34, size * 0.32, size * 0.32, radius * 0.45);
    context.fill();
  }
  context.restore();
};

const isFinderArea = (row: number, column: number, size: number) => {
  const inTopLeft = row < 7 && column < 7;
  const inTopRight = row < 7 && column >= size - 7;
  const inBottomLeft = row >= size - 7 && column < 7;
  return inTopLeft || inTopRight || inBottomLeft;
};

export const renderQrDataUrl = (matrix: boolean[][], style: QrStyleConfig, size = 1024) => {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const context = canvas.getContext('2d');

  if (!context) {
    throw new Error('无法创建二维码渲染画布');
  }

  context.clearRect(0, 0, size, size);
  context.fillStyle = style.bgColor;
  drawRoundedRect(context, 0, 0, size, size, style.glassEnabled ? size * 0.06 : 0);
  context.fill();

  if (style.glassEnabled) {
    context.fillStyle = withAlpha('#ffffff', 0.18);
    drawRoundedRect(context, 0, 0, size, size * 0.36, size * 0.06);
    context.fill();
  }

  const quiet = style.quietZone;
  const moduleSize = size / (matrix.length + quiet * 2);
  const radius = moduleSize * style.moduleRoundness;

  if (style.shadow.enabled) {
    context.shadowColor = withAlpha(style.shadow.color, style.shadow.opacity);
    context.shadowBlur = style.shadow.blur;
    context.shadowOffsetX = style.shadow.offsetX;
    context.shadowOffsetY = style.shadow.offsetY;
  }

  const gradient = style.gradient.enabled
    ? (() => {
        const linear = context.createLinearGradient(0, 0, size, size);
        linear.addColorStop(0, style.gradient.from);
        linear.addColorStop(1, style.gradient.to);
        return linear;
      })()
    : style.fgColor;

  context.fillStyle = gradient;

  matrix.forEach((row, rowIndex) => {
    row.forEach((dark, columnIndex) => {
      if (!dark || isFinderArea(rowIndex, columnIndex, matrix.length)) {
        return;
      }

      const x = (columnIndex + quiet) * moduleSize;
      const y = (rowIndex + quiet) * moduleSize;
      if (style.moduleShape === 'dot') {
        context.beginPath();
        context.arc(x + moduleSize / 2, y + moduleSize / 2, moduleSize * 0.36, 0, Math.PI * 2);
        context.fill();
        return;
      }

      const rectRadius = style.moduleShape === 'square' ? 0 : radius;
      drawRoundedRect(context, x, y, moduleSize, moduleSize, rectRadius);
      context.fill();
    });
  });

  const finderSize = moduleSize * 7;
  drawFinder(context, quiet * moduleSize, quiet * moduleSize, finderSize, style);
  drawFinder(context, (matrix.length - 7 + quiet) * moduleSize, quiet * moduleSize, finderSize, style);
  drawFinder(context, quiet * moduleSize, (matrix.length - 7 + quiet) * moduleSize, finderSize, style);

  return canvas.toDataURL('image/png');
};
