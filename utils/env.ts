import { NodeEnvironment } from "./types"

/**
 * Retrieves the list of admin user IDs from the environment variable `ADMIN_USER_IDS`.
 *
 * The environment variable should be a JSON-encoded array of strings.
 * If the variable is not set, not a valid JSON array of strings, or parsing fails,
 * an empty array is returned. Warnings or errors are logged to the console as appropriate.
 *
 * @returns {string[]} An array of admin user IDs, or an empty array if not configured properly.
 */
export function getAdminUserIds(): string[] {
  const raw = process.env.ADMIN_USER_IDS

  if (!raw) return []

  try {
    const parsed = JSON.parse(raw)
    if (Array.isArray(parsed) && parsed.every((id) => typeof id === "string")) {
      return parsed
    } else {
      console.error("ADMIN_USER_IDS is not a valid string array")
      return []
    }
  } catch (err) {
    console.error("Failed to parse ADMIN_USER_IDS:", err)
    return []
  }
}

/**
 * Represents the current environment as specified by the `NODE_ENV` environment variable.
 * Allowed values are `'development'`, `'production'`, and `'test'`.
 */
export const nodeEnvironment: NodeEnvironment = process.env.NODE_ENV

/**
 * Specifies the URL or path to redirect to after an item is added to the cart.
 * If the environment variable is not set, the value will be `undefined` and a toast will display.
*
 * The value is retrieved from the `REDIRECT_AFTER_ADDING_TO_CART` environment variable.
 *
 * @example  In your .env file define:
 * REDIRECT_AFTER_ADDING_TO_CART="/cart"
 */
export const redirectAfterAddingToCart = process.env.REDIRECT_AFTER_ADDING_TO_CART || undefined
