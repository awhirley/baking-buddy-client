/**
 * Recursively converts an object/array's snake_case keys to camelCase.
 * Leaves arrays, Dates, and primitive values untouched (aside from recursing
 * into array elements).
 */
export function toCamelCase<T = unknown>(input: unknown): T {
  if (Array.isArray(input)) {
    return input.map((item) => toCamelCase(item)) as unknown as T;
  }

  if (input !== null && typeof input === "object" && !(input instanceof Date)) {
    return Object.fromEntries(
      Object.entries(input as Record<string, unknown>).map(([key, value]) => [
        key.replace(/_([a-z0-9])/g, (_, char: string) => char.toUpperCase()),
        toCamelCase(value),
      ])
    ) as T;
  }

  return input as T;
}