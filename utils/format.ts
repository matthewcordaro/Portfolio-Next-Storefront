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
  }).format(value)
}

/**
 * Formats a given Date object into a human-readable string using the "en-US" locale.
 * The output includes the full year, the full month name, and the day of the month.
 *
 * @param date - The Date object to format.
 * @returns A formatted date string (e.g., "January 1, 2024").
 */
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date)
}
