"use client"
import { useEffect } from "react"

/**
 * A React component that detects the user's current timezone using the browser's `Intl.DateTimeFormat` API.
 *
 * - Sets a `timezone` cookie if it is missing, then reloads the page to ensure server-side rendering (SSR) uses the correct timezone.
 * - If the cookie exists but is outdated, updates it silently without reloading the page.
 * - Does not render any UI.
 *
 * @returns `null` - This component does not render anything.
 */
export default function TimezoneDetector() {
  useEffect(() => {
    // Get the user's current timezone from the browser
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone

    // Check if the timezone cookie is already set
    const currentCookie = document.cookie
      .split("; ")
      .find((row) => row.startsWith("timezone="))
      ?.split("=")[1]

    // If the cookie is missing, set it and reload the page so SSR gets the correct timezone
    if (!currentCookie) {
      document.cookie = `timezone=${timezone}; path=/; max-age=${
        60 * 60 * 24 * 30
      }` // 30 days
      window.location.reload()
    }
    // If the cookie exists but is outdated, update it silently (no reload)
    else if (currentCookie !== timezone) {
      document.cookie = `timezone=${timezone}; path=/; max-age=${
        60 * 60 * 24 * 30
      }` // 30 days
    }
  }, [])

  // This component does not render anything
  return null
}
