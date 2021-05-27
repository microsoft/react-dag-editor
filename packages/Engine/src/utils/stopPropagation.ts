export function stopPropagation<T extends { stopPropagation(): void }>(
  e: T
): void {
  e.stopPropagation();
}
