export const formatCurrency = (amount: number | null) => {
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
