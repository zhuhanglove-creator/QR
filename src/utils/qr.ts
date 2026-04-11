import type { Point, Rect } from '../types';

export const pointsToBoundingBox = (points: Point[]): Rect => {
  const xs = points.map((point) => point.x);
  const ys = points.map((point) => point.y);

  return {
    x: Math.min(...xs),
    y: Math.min(...ys),
    width: Math.max(...xs) - Math.min(...xs),
    height: Math.max(...ys) - Math.min(...ys),
  };
};

export const clampOddQrSize = (value: number) => {
  const allowed = [21, 25, 29, 33, 37, 41, 45, 49, 53, 57];
  return allowed.reduce((closest, current) => (Math.abs(current - value) < Math.abs(closest - value) ? current : closest), 29);
};
