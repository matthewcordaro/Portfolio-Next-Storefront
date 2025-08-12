"use server"
import { redirect } from "next/navigation"
import db from "./db"
import { currentUser, User } from "@clerk/nextjs/server"
import {
  imageSchema,
  productSchema,
  reviewSchema,
  validateWithZodSchema,
} from "./schema"
import { deleteImage, supabase, uploadImage } from "./supabase"
import { getAdminUserIds } from "./env"
import { revalidatePath } from "next/cache"

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
 * Retrieves the currently authenticated user and ensures they have admin privileges.
 * If the user is not an admin, redirects to the home page.
 *
 * @returns {Promise<User>} A promise that resolves to the authenticated admin user.
 * @throws Redirects to "/" if the user is not an admin.
 */
const getAdminUser = async (): Promise<User> => {
  const user = await getAuthUser()
  if (!getAdminUserIds().includes(user.id)) redirect("/")
  return user
}

/**
 * Fetches all products from the database for admin users, ordered by creation date in descending order.
 *
 * This function first ensures that the current user has admin privileges by calling `getAdminUser()`.
 * If the user is authorized, it retrieves all products from the database, sorted by the `createdAt` field.
 *
 * @returns {Promise<Product[]>} A promise that resolves to an array of product objects.
 * @throws Will throw an error if the user is not an admin or if the database query fails.
 */
export const fetchAdminProducts = async () => {
  await getAdminUser()
  const products = await db.product.findMany({
    orderBy: {
      createdAt: "desc",
    },
  })
  return products
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
export const deleteProductAction = async (prevState: { productId: string }) => {
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
export const fetchAdminProduct = async (productId: string) => {
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
 * @param prevState - Previous state (unused).
 * @param formData - FormData with updated product fields.
 * @returns Success message or error.
 */
export const updateProductAction = async (
  prevState: any,
  formData: FormData
) => {
  await getAdminUser()
  try {
    const productId = formData.get("id") as string
    const rawData = Object.fromEntries(formData)
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
 * @param prevState - The previous state, typically used for state management (not used in this function).
 * @param formData - A FormData object containing:
 *   - "image": The new image file to upload.
 *   - "id": The ID of the product to update.
 *   - "url": The URL of the old image to delete.
 * @returns An object containing a success message if the operation succeeds,
 *          or an error message if an error occurs.
 */
export const updateProductImageAction = async (
  prevState: any,
  formData: FormData
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

/**
 * Retrieves the ID of a favorite entry for the authenticated user and specified product.
 *
 * @param params - An object containing the product ID to search for.
 * @param params.productId - The ID of the product to check for a favorite entry.
 * @returns A promise that resolves to the favorite ID if found, or `null` if not found.
 */
export const fetchFavoriteId = async ({ productId }: { productId: string }) => {
  const user = await getAuthUser()
  const favorite = await db.favorite.findFirst({
    where: {
      productId,
      clerkId: user.id,
    },
    select: {
      id: true,
    },
  })
  return favorite?.id || null
}

/**
 * Toggles the favorite status of a product for the authenticated user.
 *
 * If a `favoriteId` is provided, the favorite entry is deleted (removing the product from favorites).
 * If no `favoriteId` is provided, a new favorite entry is created (adding the product to favorites).
 * After the operation, the specified path is revalidated.
 *
 * @param prevState - An object containing:
 *   - `productId`: The ID of the product to toggle favorite status for.
 *   - `favoriteId`: The ID of the favorite entry if it exists, or `null` if not.
 *   - `pathname`: The path to revalidate after the operation.
 * @returns An object with a `message` indicating the result, or an error rendered by `renderError`.
 */
export const toggleFavoriteAction = async (prevState: {
  productId: string
  favoriteId: string | null
  pathname: string
}) => {
  const user = await getAuthUser()
  const { productId, favoriteId, pathname } = prevState
  try {
    if (favoriteId) {
      await db.favorite.delete({
        where: {
          id: favoriteId,
        },
      })
    } else {
      await db.favorite.create({
        data: {
          productId,
          clerkId: user.id,
        },
      })
    }
    revalidatePath(pathname)
    return { message: favoriteId ? "Removed from Faves" : "Added to Faves" }
  } catch (error) {
    return renderError(error)
  }
}

/**
 * Fetches the list of favorite products for the currently authenticated user.
 *
 * This function retrieves the authenticated user's information and queries the database
 * for all favorite entries associated with the user's Clerk ID. Each favorite entry includes
 * the related product details.
 *
 * @returns A promise that resolves to an array of favorite entries, each including the associated product.
 */
export const fetchUserFavorites = async () => {
  const user = await getAuthUser()
  const favorites = db.favorite.findMany({
    where: {
      clerkId: user.id,
    },
    include: {
      product: true,
    },
  })
  return favorites
}

/**
 * Handles the creation of a product review.
 *
 * This asynchronous action receives the previous state and a FormData object,
 * validates the form data using a Zod schema, and creates a new review in the database.
 * The authenticated user's ID is attached to the review. After successful creation,
 * the relevant product page is revalidated. Returns a success message or an error response.
 *
 * @param _prevState - The previous state, not used in this function.
 * @param formData - The FormData object containing review data from the client.
 * @returns An object with a success message or an error rendered by `renderError`.
 */
export const createReviewAction = async (
  _prevState: any,
  formData: FormData
) => {
  const user = await getAuthUser()
  try {
    const rawData = Object.fromEntries(formData)
    const validatedData = validateWithZodSchema(reviewSchema, rawData)
    await db.review.create({
      data: {
        ...validatedData,
        clerkId: user.id,
      },
    })
    revalidatePath(`/products/${validatedData.productId}`)
    return { message: "review submitted successfully" }
  } catch (error) {
    return renderError(error)
  }
}

/**
 * Fetches all reviews for a given product, ordered by creation date in descending order.
 *
 * @param productId - The unique identifier of the product whose reviews are to be fetched.
 * @returns A promise that resolves to an array of review objects associated with the specified product.
 */
export const fetchProductReviews = async (productId: string) => {
  const reviews = await db.review.findMany({
    where: {
      productId,
    },
    orderBy: {
      createdAt: "desc",
    },
  })
  return reviews
}

export const fetchProductReviewsByUser = async () => {}

export const deleteReviewAction = async () => {}

export const findExistingReview = async () => {}

export const fetchProductRating = async () => {}
