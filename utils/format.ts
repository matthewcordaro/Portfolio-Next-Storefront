/**
 * Formats a given amount as a US Dollar currency string.
 *
 * If the provided amount is `null`, it defaults to `0`.
 *
 * @param amount - The numeric value to format as currency. If `null`, defaults to `0`.
 * @returns The formatted currency string in USD (e.g., "$1,234.56").
 */
export function formatCurrency(amount: number | null): string {
  const value = amount || 0
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    currencySign: "accounting",
  }).format(value)
}

/**
 * Formats a given `Date` object into a human-readable string in the format "Month Day, Year" (e.g., "January 1, 2024").
 * If no date is provided, the current date is used.
 *
 * @param date - The `Date` object to format. If `undefined`, the current date is used.
 * @returns A formatted date string in "Month Day, Year" format.
 */
export function formatDate(date: Date | undefined): string {
  const value = date || new Date()
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(value)
}
