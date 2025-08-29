"use server"
import { revalidatePath } from "next/cache"
import db from "../db"
import { deleteImage } from "../supabase"
import { Product, Order } from "@prisma/client"
import { redirect } from "next/navigation"
import { Message } from "../types"
import { getAdminUser } from "./userActions"
import { renderError } from "./errorActions"

/**
 * Fetches all products from the database for admin users, ordered by creation date in descending order.
 *
 * This function first ensures that the current user has admin privileges by calling `getAdminUser()`.
 * If the user is authorized, it retrieves all products from the database, sorted by the `createdAt` field.
 *
 * @returns {Promise<Product[]>} A promise that resolves to an array of product objects.
 * @throws Will throw an error if the user is not an admin or if the database query fails.
 */
export const fetchAdminProducts = async (): Promise<Product[]> => {
  await getAdminUser()
  const products = await db.product.findMany({
    orderBy: {
      createdAt: "desc",
    },
  })
  return products
}

/**
 * Deletes a product from the database by its ID.
 *
 * This action requires the user to have admin privileges. It attempts to delete
 * the product specified by `productId` from the database. Upon successful deletion,
 * it revalidates the admin products page and returns a success message.
 * If an error occurs during the deletion process, it returns a rendered error.
 *
 * @param prevState - An object containing the `productId` of the product to delete.
 * @returns An object with a success message if the product is removed, or an error if the operation fails.
 */
export const deleteProductAction = async (prevState: {
  productId: string
}): Promise<Message> => {
  await getAdminUser()
  const { productId } = prevState

  try {
    const product = await db.product.delete({
      where: {
        id: productId,
      },
    })

    await deleteImage(product.image)

    revalidatePath("/admin/products")
    return { message: "product removed" }
  } catch (error) {
    return renderError(error)
  }
}

/**
 * Fetches a product by its ID for admin users.
 *
 * This function first ensures that the current user has admin privileges by calling `getAdminUser()`.
 * It then attempts to retrieve the product with the specified `productId` from the database.
 * If the product does not exist, the user is redirected to the admin products page.
 *
 * @param productId - The unique identifier of the product to fetch.
 * @returns The product object if found.
 * @throws Redirects to "/admin/products" if the product is not found.
 */
export const fetchAdminProduct = async (
  productId: string
): Promise<Product> => {
  await getAdminUser()
  const product = await db.product.findUnique({
    where: {
      id: productId,
    },
  })
  if (!product) redirect("/admin/products")
  return product
}

/**
 * Fetches all paid orders for the admin user, ordered by creation date in descending order.
 *
 * This function first verifies the admin user by calling `getAdminUser()`.
 * It then retrieves all orders from the database where `isPaid` is `true`,
 * sorted by the `createdAt` timestamp in descending order.
 *
 * @returns {Promise<Order[]>} A promise that resolves to an array of paid orders.
 */
export const fetchAdminOrders = async (): Promise<Order[]> => {
  await getAdminUser()
  const orders = await db.order.findMany({
    orderBy: { createdAt: "desc" },
  })
  return orders
}

/**
 * Deletes all unpaid orders older than 30 minutes.
 *
 * This action requires admin privileges. It finds all orders where isPaid is false
 * and updatedAt is older than 30 minutes, then deletes them. Returns a message with the count of deleted orders.
 *
 * @returns {Promise<Message>} An object with a success message or error.
 */
export const deleteOldUnpaidOrders = async (): Promise<Message> => {
  await getAdminUser()
  try {
    const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000)

    const deleted = await db.order.deleteMany({
      where: {
        isPaid: false,
        updatedAt: { lt: thirtyMinutesAgo },
      },
    })

    revalidatePath("/admin/orders")
    return { message: `${deleted.count} old unpaid orders deleted` }
  } catch (error) {
    return renderError(error)
  }
}