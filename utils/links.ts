/**
 * Represents a navigation link with a destination URL and display label.
 *
 * @property href - The URL or path the navigation link points to.
 * @property label - The text to display for the navigation link.
 */
export type NavLink = {
  href: string
  label: string
}

const guestLinks: NavLink[] = [
  { href: "/", label: "home" },
  { href: "/about", label: "about" },
  { href: "/products", label: "products" },
]

const userLinks: NavLink[] = [
  ...guestLinks,
  { href: "/user", label: "user" },
  { href: "/favorites", label: "favorites" },
  { href: "/reviews", label: "reviews" },
  { href: "/cart", label: "cart" },
  { href: "/orders", label: "orders" },
]

const adminLinks: NavLink[] = [
  ...userLinks,
  { href: "/admin/sales", label: "dashboard" },
]

/**
 * A mapping of user roles to their respective navigation links.
 *
 * The keys are user roles defined in the `UserRole` type, and the values are arrays of `NavLink` objects
 * representing the navigation options available to each role.
 *
 * @example
 * ```typescript
 * const userNavLinks = links['user'];
 * ```
 */
export const links: Record<import("./types").UserRole, NavLink[]> = {
  guest: guestLinks,
  user: userLinks,
  admin: adminLinks,
}

/**
 * An array of navigation links for the admin sidebar.
 * Each link contains a `href` for navigation and a `label` for display.
 *
 * @remarks
 * Used to render the sidebar navigation in the admin section of the application.
 */
export const adminSidebarLinks: NavLink[] = [
  { href: "/admin/sales", label: "sales" },
  { href: "/admin/products", label: "products" },
  { href: "/admin/products/create", label: "create product" },
  { href: "/admin/tasks", label: "tasks" },
]
