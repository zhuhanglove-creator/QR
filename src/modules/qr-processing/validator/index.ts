import jsQR from 'jsqr';
import type { QrStyleConfig, ValidationResult } from '../../../types';
import { contrastRatio } from '../../../utils/color';
import { loadImage } from '../../../utils/image';

export const validateRenderedQr = async (dataUrl: string, style: QrStyleConfig): Promise<ValidationResult> => {
  const issues: ValidationResult['issues'] = [];
  const contrastScore = contrastRatio(style.fgColor, style.bgColor);
  const quietZoneScore = Math.min(1, style.quietZone / 4);

  if (contrastScore < 4.5) {
    issues.push({
      code: 'low-contrast',
      level: 'warning',
      message: '前景色与背景色对比度偏低，可能影响扫码。',
      suggestion: '建议将二维码前景色调深或背景色调浅。',
    });
  }

  if (style.quietZone < 4) {
    issues.push({
      code: 'quiet-zone',
      level: 'warning',
      message: 'Quiet zone 小于建议值 4 模块。',
      suggestion: '建议将 quiet zone 调整到 4 或更高。',
    });
  }

  const image = await loadImage(dataUrl);
  const canvas = document.createElement('canvas');
  canvas.width = image.width;
  canvas.height = image.height;
  const context = canvas.getContext('2d');
  if (!context) {
    throw new Error('无法创建校验画布');
  }
  context.drawImage(image, 0, 0);
  const imageData = context.getImageData(0, 0, image.width, image.height);
  const decoded = jsQR(imageData.data, imageData.width, imageData.height, {
    inversionAttempts: 'attemptBoth',
  });

  if (!decoded) {
    issues.push({
      code: 'decode-failed',
      level: 'fail',
      message: '当前样式未通过浏览器端回扫校验。',
      suggestion: '建议切回安全模式，减少渐变、发光和透明效果。',
    });
  }

  return {
    level: issues.some((item) => item.level === 'fail') ? 'fail' : issues.length ? 'warning' : 'pass',
    scannable: Boolean(decoded),
    contrastScore,
    quietZoneScore,
    decodePassed: Boolean(decoded),
    issues,
    lastCheckedAt: new Date().toISOString(),
  };
};
