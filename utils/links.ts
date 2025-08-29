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
 * @remarks
 * - `guestLinks`, `userLinks`, and `adminLinks` should be arrays of `NavLink` objects defined elsewhere.
 * - This object is useful for rendering role-based navigation menus.
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

export const adminSidebarLinks: NavLink[] = [
  { href: "/admin/sales", label: "sales" },
  { href: "/admin/products", label: "products" },
  { href: "/admin/products/create", label: "create product" },
  { href: "/admin/tasks", label: "tasks" },
]
