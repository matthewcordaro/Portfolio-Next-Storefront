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
