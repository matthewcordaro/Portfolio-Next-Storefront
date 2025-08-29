"use server"
import { redirect } from "next/navigation"
import db from "../db"
import {
  imageSchema,
  productSchema,
  validateWithZodSchema,
} from "../schema"
import { deleteImage, uploadImage } from "../supabase"
import { revalidatePath } from "next/cache"
import { Product } from "@prisma/client"
import { ActionFunction } from "../types"
import { currencyStringToIntegerCents } from "../format"
import { getAuthUser, getAdminUser, renderError } from "./serverActions"

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
 * Fetches all products that are marked as featured from the database.
 *
 * @returns A promise that resolves to an array of featured products, ordered by creation date in descending order.
 */
export const fetchFeatureProducts = async (): Promise<Product[]> => {
  return await db.product.findMany({
    where: {
      featured: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  })
}

/**
 * Fetches all products from the database that match the given search query.
 *
 * Searches for products where the `name` or `company` fields contain the provided search string,
 * using a case-insensitive match. Results are ordered by creation date in descending order.
 *
 * @param params - An object containing the search parameters.
 * @param params.search - The search string to filter products by name or company. Defaults to an empty string.
 * @returns A promise that resolves to an array of matching products.
 */
export const fetchAllProducts = async ({ search = "" }): Promise<Product[]> => {
  return await db.product.findMany({
    where: {
      OR: [
        { name: { contains: search, mode: "insensitive" } },
        { company: { contains: search, mode: "insensitive" } },
      ],
    },
    orderBy: {
      createdAt: "desc",
    },
  })
}

/**
 * Fetches a single product from the database by its unique identifier.
 *
 * @param productId - The unique identifier of the product to fetch.
 * @returns A promise that resolves to the product object if found.
 * @throws Redirects to the "/products" page if the product is not found.
 */
export const fetchSingleProduct = async (
  productId: string
): Promise<Product> => {
  const product = await db.product.findUnique({
    where: { id: productId },
  })
  if (!product) redirect("/products")
  return product
}

/**
 * Handles the creation of a new product by validating form data, uploading an image,
 * and saving the product to the database. Redirects to the products admin page upon success.
 * Returns an error message if any step fails.
 *
 * @param _prevState - The previous state (unused).
 * @param formData - The form data containing product details and an image file.
 * @returns A promise that resolves to an object containing a message string.
 */
export const createProductAction: ActionFunction = async (
  _prevState,
  formData
) => {
  const user = await getAuthUser()

  try {
    const rawData = Object.fromEntries(formData)
    rawData.price = currencyStringToIntegerCents(
      rawData.price.toString()
    ).toString()
    const validatedData = validateWithZodSchema(productSchema, rawData)
    const file = formData.get("image") as File
    const validatedImageFile = validateWithZodSchema(imageSchema, {
      image: file,
    })
    const fullPath = await uploadImage(validatedImageFile.image)

    await db.product.create({
      data: {
        ...validatedData,
        image: fullPath,
        clerkId: user.id,
      },
    })
  } catch (error) {
    return renderError(error)
  }
  redirect("/admin/products")
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
}) => {
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
 * Updates a product in the database from form data.
 *
 * @param _prevState - The previous state (unused).
 * @param formData - The form data with updated product fields.
 * @returns Success message or error.
 */
export const updateProductAction: ActionFunction = async (
  _prevState,
  formData
) => {
  await getAdminUser()
  try {
    const productId = formData.get("id") as string
    const rawData = Object.fromEntries(formData)
    rawData.price = currencyStringToIntegerCents(
      rawData.price.toString()
    ).toString()
    const validatedData = validateWithZodSchema(productSchema, rawData)
    await db.product.update({
      where: { id: productId },
      data: { ...validatedData },
    })
    revalidatePath(`/admin/products/${productId}/edit`)
  } catch (error) {
    return renderError(error)
  }
  return { message: "Product updated successfully" }
}

/**
 * Updates the image of a product by uploading a new image, deleting the old image,
 * and updating the product record in the database. Requires admin privileges.
 *
 * @param _prevState - The previous state (unused).
 * @param formData - The form data containing:
 *   - "image": The new image file to upload.
 *   - "id": The ID of the product to update.
 *   - "url": The URL of the old image to delete.
 * @returns An object containing a success message if the operation succeeds,
 *          or an error message if an error occurs.
 */
export const updateProductImageAction: ActionFunction = async (
  _prevState,
  formData
) => {
  await getAdminUser()
  try {
    const image = formData.get("image") as File
    const productId = formData.get("id") as string
    const oldImageUrl = formData.get("url") as string

    const validatedFile = validateWithZodSchema(imageSchema, { image })
    const fullPath = await uploadImage(validatedFile.image)

    await deleteImage(oldImageUrl)

    await db.product.update({
      where: {
        id: productId,
      },
      data: {
        image: fullPath,
      },
    })
    revalidatePath(`/admin/products/${productId}/edit`)
    return { message: "Product image updated successfully" }
  } catch (error) {
    return renderError(error)
  }
}