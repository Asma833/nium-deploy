/**
 * Creates a debounced function that delays invoking the provided function
 * until after 'wait' milliseconds have elapsed since the last time it was invoked.
 * 
 * @template T - Function type that needs to be debounced
 * @param {T} func - The function to debounce
 * @param {number} wait - The number of milliseconds to delay
 * @returns {T} A debounced version of the provided function
 * 
 * @example
 * const debouncedSearch = debounce((query: string) => {
 *   // search logic here
 * }, 300);
 */
export function debounce<T extends (...args: any[]) => void>(
  func: T,
  wait: number
): T {
  let timeout: NodeJS.Timeout | undefined;

  return function executedFunction(this: any, ...args: Parameters<T>) {
    const later = () => {
      timeout = undefined;
      func.apply(this, args);
    };

    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  } as T;
}
