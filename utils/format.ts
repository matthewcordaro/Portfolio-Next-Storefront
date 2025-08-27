/**
 * Formats a given amount as a US Dollar currency string.
 *
 * If the provided amount is `null`, it defaults to `0`.
 *
 * @param amountInCents - The numeric value to format as currency. If `null`, defaults to `0`.
 * @returns The formatted currency string in USD (e.g., 123456 -> "$1,234.56").
 */
export function formatCurrency(amountInCents: number | null): string {
  const value = (amountInCents ?? 0) / 100 // Convert cents to dollars
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    currencySign: "accounting",
  }).format(value)
}

/**
 * Converts a currency string to its integer value in cents.
 *
 * This function removes any non-numeric characters (except for decimal points and minus signs)
 * from the input string, parses it as a floating-point number, and returns the value in cents
 * as an integer by multiplying by 100 and rounding to the nearest whole number.
 *
 * @param amount - The currency amount as a string (e.g., "$12.34", "€56.78").
 * @returns The integer value in cents (e.g., "12.34" returns 1234).
 */
export function currencyStringToIntegerCents(amount: string): number {
  const parsed = parseFloat(amount.replace(/[^0-9.-]+/g, "")) || 0
  return Math.round(parsed * 100)
}

/**
 * Converts an amount in integer cents to its currency value as a number.
 *
 * @param amountInCents - The amount in cents to be converted.
 * @returns The equivalent currency value as a number.
 */
export function integerCentsToCurrencyNumber(amountInCents: number): number {
  return amountInCents / 100
}

/**
 * Formats a given `Date` object into a human-readable string in the format "Month Day, Year" (e.g., "January 1, 2024").
 * If no date is provided, the current date is used.
 *
 * @param date - The `Date` object to format. If `undefined`, the current date is used.
 * @param timeZone - An optional time zone identifier (e.g., "America/New_York"). Defaults to "UTC" (Universal Time).
 * @returns A formatted date string in "Month Day, Year" format.
 */
export function formatDate(
  date: Date | undefined,
  timeZone: string = "UTC"
): string {
  const value = date || new Date()
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: timeZone,
  }).format(value)
}

/**
 * Formats a given `Date` object into a short time string using the "en-US" locale.
 *
 * If no date is provided, the current time is used.
 *
 * @param date - The `Date` object to format. If `undefined`, the current time is used.
 * @param timeZone - An optional time zone identifier (e.g., "America/New_York"). Defaults to "UTC" (Universal Time).
 * @param showTimeZone - If `true`, appends the time zone abbreviation (e.g., "EST", "EDT") to the result.
 *   The abbreviation will reflect daylight saving time if applicable for the date and zone.
 * @returns A string representing the formatted time (e.g., "3:45 PM EDT").
 */
export function formatTime(
  date: Date | undefined,
  timeZone: string = "UTC",
  showTimeZone = false
): string {
  const value = date || new Date()
  let timeString = new Intl.DateTimeFormat("en-US", {
    timeStyle: "short",
    timeZone: timeZone,
  }).format(value)

  // Get the time zone abbreviation
  if (showTimeZone)
    timeString +=
      " " +
      value
        .toLocaleTimeString("en-US", {
          timeZone: timeZone,
          timeZoneName: "short",
        })
        .split(" ")
        .pop()

  return timeString
}
