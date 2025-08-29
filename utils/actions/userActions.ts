"use server"
import { redirect } from "next/navigation"
import { currentUser, User } from "@clerk/nextjs/server"
import { getAdminUserIds } from "../env"
import { UserRole } from "../types"

/**
 * Retrieves the currently authenticated user.
 *
 * @returns {Promise<User>} A promise that resolves to the authenticated user.
 * @throws Redirects to the root path ("/") if no user is authenticated.
 */
export async function getAuthUser(): Promise<User> {
  const user = await currentUser()
  if (!user) redirect("/")
  return user
}

/**
 * Retrieves the currently authenticated user and ensures they have admin privileges.
 * If the user is not an admin, redirects to the home page.
 *
 * @returns {Promise<User>} A promise that resolves to the authenticated admin user.
 * @throws Redirects to "/" if the user is not an admin.
 */
export async function getAdminUser(): Promise<User> {
  const user = await getAuthUser()
  if (!getAdminUserIds().includes(user.id)) redirect("/")
  return user
}

/**
 * Determines the type of a user based on their presence and ID.
 *
 * @param user - The user object or `null` if no user is authenticated.
 * @returns The type of the user: `"guest"` if no user is provided, `"admin"` if the user's ID is in the admin list, or `"user"` otherwise.
 */
export async function getCurrentUserType(): Promise<UserRole> {
  const user = await currentUser()
  if (!user) return "guest"
  if (getAdminUserIds().includes(user.id)) return "admin"
  return "user"
}