/**
 * Seeded Fisher-Yates shuffle logic from spec.
 * Every student gets a different question order, but same order on refresh.
 */
export function seededShuffle<T>(array: T[], seed: string): T[] {
  const arr = [...array];
  let hash = [...seed].reduce((acc, c) => acc + c.charCodeAt(0), 0);
  for (let i = arr.length - 1; i > 0; i--) {
    hash = (hash * 1664525 + 1013904223) & 0xffffffff;
    const j = Math.abs(hash) % (i + 1);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
