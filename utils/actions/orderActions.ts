"use server"
import { redirect } from "next/navigation"
import db from "../db"
import { Order } from "@prisma/client"
import {
  Message,
  CartWithProducts,
} from "../types"
import { getAuthUser } from "./userActions"
import { renderError } from "./errorActions"
import { fetchOrCreateCart } from "./cartActions"

/**
 * Creates a new order for the authenticated user.
 *
 * Executes a database transaction to:
 *  - Create a new order with cart details and user email.
 *  - Create ordered items for each cart item.
 *
 * On success, this function will redirect to the checkout page and never return a value.
 * On error, it returns a message object describing the error.
 *
 * @returns {Promise<Message|never>} A promise that either redirects (never returns) on success,
 * or resolves to an error message object.
 */
export const createOrderAction = async (): Promise<Message | never> => {
  const user = await getAuthUser()
  let order: Order
  let cart: CartWithProducts
  try {
    // Check for user email before creating the order
    if (!user.emailAddresses?.length)
      throw new Error("User does not have an email address.")

    // Fetch the cart; error if not found
    cart = await fetchOrCreateCart(user.id, true)

    // Create the order
    order = await db.order.create({
      data: {
        clerkId: user.id,
        numItems: cart.numItemsInCart,
        orderTotal: cart.orderTotal,
        subTotal: cart.cartTotal,
        tax: cart.tax,
        shipping: cart.shipping,
        email: user.emailAddresses[0].emailAddress,
      },
    })

    // Create all the ordered items associated with the order
    await Promise.all(
      cart.cartItems.map((cartItem) =>
        db.orderedItem.create({
          data: {
            orderId: order.id,
            productId: cartItem.productId,
            amount: cartItem.amount,
            price: cartItem.product.price,
          },
        })
      )
    )
  } catch (error) {
    return renderError(error)
  }
  redirect(`/checkout?orderId=${order.id}&cartId=${cart.id}`)
}

/**
 * Fetches all paid orders for the currently authenticated user.
 *
 * Retrieves the authenticated user's ID and queries the database for orders
 * associated with that user (`clerkId`) that have been marked as paid (`isPaid: true`).
 * The results are ordered by creation date in descending order.
 *
 * @returns {Promise<Order[]>} A promise that resolves to an array of the user's paid orders.
 */
export const fetchUserOrders = async (): Promise<Order[]> => {
  const user = await getAuthUser()
  const orders = await db.order.findMany({
    where: {
      clerkId: user.id,
      isPaid: true,
    },
    orderBy: { createdAt: "desc" },
  })
  return orders
}