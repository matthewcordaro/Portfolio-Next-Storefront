export type NavLink = {
  href: string
  label: string
}

export const guestLinks: NavLink[] = [
  { href: "/", label: "home" },
  { href: "/about", label: "about" },
  { href: "/products", label: "products" },
]

export const userLinks: NavLink[] = [
  ...guestLinks,
  { href: "/user", label: "user" },
  { href: "/favorites", label: "favorites" },
  { href: "/reviews", label: "reviews" },
  { href: "/cart", label: "cart" },
  { href: "/orders", label: "orders" },
]

export const adminLinks: NavLink[] = [
  ...userLinks,
  { href: "/admin/sales", label: "dashboard" },
]

export const adminSidebarLinks: NavLink[] = [
  { href: "/admin/sales", label: "sales" },
  { href: "/admin/products", label: "products" },
  { href: "/admin/products/create", label: "create product" },
  { href: "/admin/tasks", label: "tasks" },
]
