"use server"
import { redirect } from "next/navigation"
import db from "../db"
import { auth } from "@clerk/nextjs/server"
import { redirectAfterAddingToCart } from "../env"
import { revalidatePath } from "next/cache"
import { Cart } from "@prisma/client"
import { ActionFunction, CartWithProducts } from "../types"
import pluralize from "pluralize-esm"
import { getAuthUser, renderError, updateOrCreateCartItem, fetchProduct } from "./serverActions"

/**
 * Fetches the number of items in the current user's cart.
 *
 * This function retrieves the authenticated user's ID, queries the database for the cart
 * associated with that user, and returns the number of items in the cart. If no cart is found,
 * it returns 0.
 *
 * @returns {Promise<number>} The number of items in the user's cart, or 0 if no cart exists.
 */
export const fetchNumberOfCartItems = async (): Promise<number> => {
  const { userId } = auth()
  const cart = await db.cart.findFirst({
    where: {
      clerkId: userId ?? "",
    },
    select: {
      numItemsInCart: true,
    },
  })
  return cart?.numItemsInCart || 0
}

/**
 * Fetches the cart for a given user by their `userId`. If no cart exists and `errorIfNone` is `false`,
 * creates a new cart for the user. If `errorIfNone` is `true` and no cart is found, throws an error.
 *
 * @param {string} userId - The unique identifier for the user.
 * @param {boolean} [errorIfNone=false] - Whether to throw an error if no cart is found.
 * @returns {Promise<CartWithProducts>} A promise that resolves to the user's cart with products.
 * @throws {Error} If no cart is found and `errorIfNone` is `true`.
 */
export const fetchOrCreateCart = async (
  userId: string,
  errorIfNone: boolean = false
): Promise<CartWithProducts> => {
  let cart = await db.cart.findFirst({
    where: { clerkId: userId },
    include: {
      cartItems: {
        include: { product: true },
        orderBy: { createdAt: "desc" },
      },
    },
  })
  if (!cart && errorIfNone)
    throw new Error(`Cart not found for userId: ${userId}`)
  if (!cart) {
    cart = await db.cart.create({
      data: { clerkId: userId },
      include: { cartItems: { include: { product: true } } },
    })
  }
  return cart
}

/**
 * Updates the cart summary fields based on its current items.
 *
 * This function recalculates the number of items, subtotal, tax, shipping, and order total
 * for the given cart. It fetches all cart items, computes the totals, and updates the cart
 * record in the database accordingly.
 *
 * @param {Cart} cart - The cart object to update, containing its ID, tax rate, and shipping cost.
 * @returns {Promise<void>} A promise that resolves when the cart has been updated in the database.
 */
export const updateCart = async (cart: Cart): Promise<void> => {
  const cartItems = await db.cartItem.findMany({
    where: { cartId: cart.id },
    include: { product: true },
  })

  let numItemsInCart = 0
  let cartTotal = 0

  for (const item of cartItems) {
    numItemsInCart += item.amount
    cartTotal += item.amount * item.product.price
  }

  const tax = cart.taxRate * cartTotal
  const shipping = cartTotal ? cart.shipping : 0
  const orderTotal = cartTotal + tax + shipping

  await db.cart.update({
    where: { id: cart.id },
    data: { numItemsInCart, cartTotal, tax, orderTotal },
  })
  // Revalidate the paths with cart info
  revalidatePath("/cart")
  revalidatePath("/")
}

/**
 * Handles the action of adding a product to the user's cart.
 *
 * This function retrieves the authenticated user's ID, fetches the product and the user's cart,
 * updates or creates the cart item with the specified amount, and updates the cart accordingly.
 * Returns a success message indicating the number of products added, or an error message if the operation fails.
 *
 * @param _prevState - The previous state (unused in this action).
 * @param formData - The form data containing "productId" and "amount".
 * @returns An object containing a success message, or the result of `renderError` if an error occurs.
 * @throws Redirects to defined location if `redirectAfterAddingToCart` defined in `env.ts`.
 */
export const addToCartAction: ActionFunction = async (_prevState, formData) => {
  const userId = (await getAuthUser()).id
  let message: string
  try {
    const productId = formData.get("productId") as string
    const amount = Number(formData.get("amount"))
    const product = await fetchProduct(productId)
    const cart: Cart = await fetchOrCreateCart(userId)
    await updateOrCreateCartItem(productId, cart.id, amount)
    await updateCart(cart)

    message = `${amount} ${pluralize(product.name, amount)} ${
      amount > 1 ? "have" : "has"
    } been added to your cart`
  } catch (error) {
    return renderError(error)
  }
  const redirectPath = redirectAfterAddingToCart
  if (redirectPath) redirect(redirectPath)
  return { message }
}

/**
 * Removes an item from the user's cart.
 *
 * This action function retrieves the authenticated user, fetches or creates their cart,
 * deletes the specified cart item, updates the cart, and revalidates the cart page.
 * Returns a success message if the item is removed, or an error message if the operation fails.
 *
 * @param _prevState - The previous state (unused).
 * @param formData - The form data containing the cart item ID to remove.
 * @returns An object with a success message, or an error message if removal fails.
 */
export const removeCartItemAction: ActionFunction = async (
  _prevState,
  formData
) => {
  const user = await getAuthUser()
  try {
    const cartItemId = formData.get("id") as string
    const cart = await fetchOrCreateCart(user.id, true)
    await db.cartItem.delete({
      where: {
        id: cartItemId,
        cartId: cart.id,
      },
    })

    await updateCart(cart)
    return { message: "Item removed from cart" }
  } catch (error) {
    return renderError(error)
  }
}

/**
 * Updates the amount of a specific cart item for the authenticated user.
 *
 * This function fetches or creates the user's cart, updates the specified cart item's amount,
 * updates the cart, and revalidates the cart page. Returns a success message or an error.
 *
 * @param params - An object containing:
 *   @param amount - The new quantity for the cart item.
 *   @param cartItemId - The unique identifier of the cart item to update.
 * @returns An object with a success message, or an error rendered by `renderError`.
 */
export const updateCartItemAction = async ({
  amount,
  cartItemId,
}: {
  amount: number
  cartItemId: string
}) => {
  const user = await getAuthUser()

  try {
    const cart = await fetchOrCreateCart(user.id, true)
    await db.cartItem.update({
      where: {
        id: cartItemId,
        cartId: cart.id,
      },
      data: {
        amount,
      },
    })
    await updateCart(cart)
    return { message: "cart updated" }
  } catch (error) {
    return renderError(error)
  }
}