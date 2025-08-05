import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

// Declare redirect mappings
const redirects: Record<string, string> = {
  "/admin": "/admin/dashboard",
  "/admin/dashboard": "/admin/sales",
}

// Dynamically build matcher entries
const redirectMatchers = Object.keys(redirects)

// Public routes for Clerk
const isPublicRoute = createRouteMatcher(["/", "/products(.*)", "/about"])

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
    ...redirectMatchers, // Inject all redirect paths here
  ],
}

// Redirect chaining helper
function getFinalRedirect(pathname: string): string | null {
  const visited = new Set<string>()
  let current = pathname

  while (redirects[current]) {
    if (visited.has(current)) {
      console.error(
        `[RedirectLoop] Detected redirect loop at: ${current}. Chain: ${[
          ...visited,
        ].join(" → ")} → ${current}`
      )
      return null // Prevent infinite loop
    }

    current = redirects[current]
  }

  return current !== pathname ? current : null
}

export default clerkMiddleware((auth, request) => {
  // Clerk protection
  if (!isPublicRoute(request)) auth().protect()

  // Redirect handling
  const { pathname } = request.nextUrl
  const finalTarget = getFinalRedirect(pathname)

  if (finalTarget) {
    return NextResponse.redirect(new URL(finalTarget, request.url))
  }

  // Fallthrough
  return NextResponse.next()
})
