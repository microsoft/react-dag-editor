export const getCurvePathD = (x1: number, x2: number, y1: number, y2: number): string => {
  // The ports are even width in px. and paths are 2 px. wide. We therefore subtract 1 from the HalfWidth to have them appear centered -- center of the path lines up with center of the port.

  return `M${x1},${y1}C${x1},${y1 - getControlPointDistance(y1, y2)},${x2},${
    y2 + 5 + getControlPointDistance(y1, y2)
  },${x2},${y2 + 5}`;
};

const getControlPointDistance = (y1: number, y2: number): number => {
  return Math.min(
    5 * 15, // 5 is port height
    Math.max(5 * 3, Math.abs((y1 - (y2 + 5)) / 2)),
  );
};
