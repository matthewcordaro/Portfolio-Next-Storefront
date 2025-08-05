import {
  clerkMiddleware as middleware,
  createRouteMatcher,
} from "@clerk/nextjs/server"
import { NextRequest, NextResponse } from "next/server"

// Declare redirect mappings
const redirects: Record<string, string> = {
  "/admin": "/admin/dashboard",
  "/admin/dashboard": "/admin/sales",
}

// Public routes for Clerk
const isPublicRoute = createRouteMatcher(["/", "/products(.*)", "/about"])

// Administrative Routes
const isAdminRoute = createRouteMatcher(["/admin(.*)"])

// Redirect chaining helper
function getFinalRedirect(request: NextRequest): URL | null {
  const visited = new Set<string>()
  const { pathname } = request.nextUrl
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
  return current !== pathname ? new URL(current, request.url) : null
}

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
    // Matching from redirect.keys()
    // Wish this could be done at compile time.
    "/admin",
    "/admin/dashboard",
  ],
}

export default middleware((auth, request) => {
  // Unauthorized
  const isAdminUser = auth().userId === process.env.ADMIN_USER_ID
  if (isAdminRoute(request) && !isAdminUser) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  // Clerk protection
  if (!isPublicRoute(request)) auth().protect()

  // Redirect handling
  const finalTarget = getFinalRedirect(request)
  if (finalTarget) {
    return NextResponse.redirect(finalTarget)
  }

  // Fallthrough
  return NextResponse.next()
})
