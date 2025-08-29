"use server"
import { redirect } from "next/navigation"
import db from "../db"
import { auth, currentUser, User } from "@clerk/nextjs/server"
import { getAdminUserIds } from "../env"
import { Message, UserRole } from "../types"

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

/**
 * Logs the provided error to the console and returns a standardized error object.
 *
 * @param error - The error to be handled. Can be of any type.
 * @returns An object containing a `message` property with the error message if the input is an `Error`,
 *          or a generic message if the error type is unknown.
 */
export function renderError(error: unknown): Message {
  console.log(error)
  return {
    message:
      error instanceof Error ? error.message : "an unknown error occurred",
    error: true,
  }
}

/**
 * Updates the amount of an existing cart item or creates a new cart item if it does not exist.
 *
 * If a cart item with the specified `productId` and `cartId` exists, its `amount` is incremented by the provided `amount`.
 * Otherwise, a new cart item is created with the given `productId`, `cartId`, and `amount`.
 *
 * @param {string} productId - The unique identifier of the product to add or update in the cart.
 * @param {string} cartId - The unique identifier of the cart.
 * @param {number} amount - The quantity to add to the cart item.
 * @returns {Promise<void>} A promise that resolves when the operation is complete.
 */
export async function updateOrCreateCartItem(
  productId: string,
  cartId: string,
  amount: number
): Promise<void> {
  const cartItem = await db.cartItem.findFirst({ where: { productId, cartId } })
  if (cartItem) {
    await db.cartItem.update({
      where: { id: cartItem.id },
      data: { amount: cartItem.amount + amount },
    })
  } else {
    await db.cartItem.create({ data: { amount, productId, cartId } })
  }
}

/**
 * Fetches a product from the database by its unique identifier.
 *
 * @param productId - The unique identifier of the product to fetch.
 * @returns A promise that resolves to the product object if found.
 * @throws {Error} If the product with the given ID is not found.
 */
export async function fetchProduct(productId: string) {
  const product = await db.product.findUnique({ where: { id: productId } })
  if (!product) throw new Error(`Product ID ${productId}, not found`)
  return product
}