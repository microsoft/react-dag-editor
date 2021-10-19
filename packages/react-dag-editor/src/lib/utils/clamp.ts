/**
 * @param min
 * @param max
 * @param value
 */
export function clamp(min: number, max: number, value: number): number {
  if (min > value) {
    return min;
  }
  if (max < value) {
    return max;
  }
  return value;
}
