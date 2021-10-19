export function nextFrame(callback: () => void): void {
  // double requestAnimationFrame guarantee next frame
  // https://bugs.chromium.org/p/chromium/issues/detail?id=675795
  requestAnimationFrame(() => {
    requestAnimationFrame(callback);
  });
}
