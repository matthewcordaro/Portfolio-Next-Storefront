"use server"
import { revalidatePath } from "next/cache"
import db from "../db"
import {
  reviewSchema,
  validateWithZodSchema,
} from "../schema"
import { Review } from "@prisma/client"
import {
  Message,
  ProductReviewWithProduct,
  ActionFunction,
} from "../types"
import { getAuthUser } from "./userActions"
import { renderError } from "./errorActions"

/**
 * Handles the creation of a product review.
 *
 * This asynchronous action receives the previous state and a FormData object,
 * validates the form data using a Zod schema, and creates a new review in the database.
 * The authenticated user's ID is attached to the review. After successful creation,
 * the relevant product page is revalidated. Returns a success message or an error response.
 *
 * @param _prevState - The previous state (unused).
 * @param formData - The form data containing review data from the client.
 * @returns An object with a success message or an error rendered by `renderError`.
 */
export const createReviewAction: ActionFunction = async (
  _prevState,
  formData
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
export const fetchProductReviews = async (
  productId: string
): Promise<Review[]> => {
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

/**
 * Fetches the average rating and total count of reviews for a given product.
 *
 * @param productId - The unique identifier of the product to fetch ratings for.
 * @returns A promise that resolves to an object containing:
 * - `rating`: The average rating (rounded to one decimal place), or 0 if there are no reviews.
 * - `count`: The total number of ratings for the product.
 */
export const fetchProductRating = async (
  productId: string
): Promise<{ rating: number; count: number }> => {
  const result = await db.review.groupBy({
    by: ["productId"],
    _avg: {
      rating: true,
    },
    _count: {
      rating: true,
    },
    where: {
      productId,
    },
  })

  // empty array if no reviews
  return {
    rating: result[0]?._avg.rating
      ? Number(result[0]._avg.rating.toFixed(1))
      : 0,
    count: result[0]?._count.rating ?? 0,
  }
}

/**
 * Fetches all product reviews written by the currently authenticated user.
 *
 * This function retrieves the authenticated user's information and queries the database
 * for all reviews associated with the user's `clerkId`. Each review includes its `id`,
 * `rating`, `comment`, and the associated product's `image` and `name`.
 *
 * @returns {Promise<ProductReviewWithProduct[]>} A promise that resolves to an array of user-authored product reviews.
 */
export const fetchProductReviewsWithProductForAuthUser = async (): Promise<
  ProductReviewWithProduct[]
> => {
  const user = await getAuthUser()
  const reviews = await db.review.findMany({
    where: {
      clerkId: user.id,
    },
    include: { product: { select: { image: true, name: true } } },
  })
  return reviews
}

/**
 * Deletes a review from the database based on the provided review ID and the authenticated user's ID.
 *
 * @param prevState - An object containing the `reviewId` of the review to be deleted.
 * @returns A promise that resolves to an object with a success message if the review is deleted,
 *          or an error object if the operation fails.
 *
 * @remarks
 * - This function requires the user to be authenticated.
 * - After successful deletion, it triggers a revalidation of the "/reviews" path.
 */
export const deleteReviewAction = async (prevState: {
  reviewId: string
}): Promise<Message> => {
  const { reviewId } = prevState
  const user = await getAuthUser()

  try {
    await db.review.delete({
      where: {
        id: reviewId,
        clerkId: user.id,
      },
    })
    revalidatePath("/reviews")
    return { message: "Review deleted successfully" }
  } catch (error) {
    return renderError(error)
  }
}

/**
 * Updates a review in the database based on the provided review ID and the authenticated user's ID.
 *
 * @param newState - An object containing the `productId`, `reviewId`, `rating`, and `comment` to update the review.
 * @returns A promise that resolves to an object with a success message if the review is updated,
 *          or an error object if the operation fails.
 *
 * @remarks
 * - This function requires the user to be authenticated.
 * - After successful update, it triggers a revalidation of the "/reviews" path.
 */
export const updateReviewAction = async (newState: {
  productId: string
  reviewId: string
  rating: number
  comment: string
}): Promise<Message> => {
  const { productId, reviewId, rating, comment } = newState
  const user = await getAuthUser()
  try {
    // Use validateWithZodSchema for partial validation
    validateWithZodSchema(reviewSchema, { rating, comment }, true)
    await db.review.update({
      where: {
        id: reviewId,
        clerkId: user.id,
      },
      data: {
        rating,
        comment,
      },
    })
    revalidatePath("/reviews")
    revalidatePath(`/products/${productId}`)
    return { message: "Review updated successfully" }
  } catch (error) {
    return renderError(error)
  }
}

/**
 * Finds an existing review for a given user and product.
 *
 * @param userId - The unique identifier of the user (clerkId).
 * @param productId - The unique identifier of the product.
 * @returns A promise that resolves to the first matching review, or `null` if none is found.
 */
export const findExistingReview = async (
  userId: string,
  productId: string
): Promise<Review | null> => {
  return db.review.findFirst({
    where: {
      clerkId: userId,
      productId,
    },
  })
}