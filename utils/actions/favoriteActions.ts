"use server"
import { revalidatePath } from "next/cache"
import db from "../db"
import {
  Message,
  FavoriteWithProduct,
} from "../types"
import { getAuthUser } from "./userActions"
import { renderError } from "./errorActions"

/**
 * Retrieves the ID of a favorite entry for the authenticated user and specified product.
 *
 * @param params - An object containing the product ID to search for.
 * @param params.productId - The ID of the product to check for a favorite entry.
 * @returns A promise that resolves to the favorite ID if found, or `null` if not found.
 */
export const fetchFavoriteId = async ({
  productId,
}: {
  productId: string
}): Promise<string | null> => {
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
}): Promise<Message> => {
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
export const fetchUserFavorites = async (): Promise<FavoriteWithProduct[]> => {
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