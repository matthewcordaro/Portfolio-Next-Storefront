"use server"
import { redirect } from "next/navigation"
import db from "./db"
import { currentUser, User } from "@clerk/nextjs/server"
import { imageSchema, productSchema, validateWithZodSchema } from "./schema"
import { uploadImage } from "./supabase"

/**
 * Retrieves the currently authenticated user.
 *
 * @returns {Promise<User>} A promise that resolves to the authenticated user.
 * @throws Redirects to the root path ("/") if no user is authenticated.
 */
const getAuthUser = async (): Promise<User> => {
  const user = await currentUser()
  if (!user) redirect("/")
  return user
}

/**
 * Logs the provided error to the console and returns a standardized error object.
 *
 * @param error - The error to be handled. Can be of any type.
 * @returns An object containing a `message` property with the error message if the input is an `Error`,
 *          or a generic message if the error type is unknown.
 */
function renderError(error: unknown) {
  console.log(error)
  return {
    message:
      error instanceof Error ? error.message : "an unknown error occurred",
  }
}

/**
 * Fetches all products that are marked as featured from the database.
 *
 * @returns A promise that resolves to an array of featured products, ordered by creation date in descending order.
 */
export const fetchFeatureProducts = async () => {
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
export const fetchAllProducts = async ({ search = "" }) => {
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
export const fetchSingleProduct = async (productId: string) => {
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
 * @param prevState - The previous state, typically used for state management in actions.
 * @param formData - The form data containing product details and an image file.
 * @returns A promise that resolves to an object containing a message string.
 */
export const createProductAction = async (
  prevState: any,
  formData: FormData
): Promise<{ message: string }> => {
  const user = await getAuthUser()

  try {
    const data = Object.fromEntries(formData)
    const validatedData = validateWithZodSchema(productSchema, data)
    const file = formData.get("image") as File
    const validatedImageFile = validateWithZodSchema(imageSchema, { image: file })
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
  redirect('/admin/products')
}
