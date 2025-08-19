"use server"
import { redirect } from "next/navigation"
import db from "./db"
import { auth, currentUser, User } from "@clerk/nextjs/server"
import {
  imageSchema,
  productSchema,
  reviewSchema,
  validateWithZodSchema,
} from "./schema"
import { deleteImage, uploadImage } from "./supabase"
import { getAdminUserIds } from "./env"
import { revalidatePath } from "next/cache"
import {
  Product,
  Cart,
  Favorite,
  Review,
  CartItem,
  Prisma,
} from "@prisma/client"
import {
  Message,
  UserProductReview,
  ActionFunction,
  CartWithProducts,
} from "./types"
import pluralize from "pluralize-esm"

/**
 * Retrieves the currently authenticated user.
 *
 * @returns {Promise<User>} A promise that resolves to the authenticated user.
 * @throws Redirects to the root path ("/") if no user is authenticated.
 */
async function getAuthUser(): Promise<User> {
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
async function getAdminUser(): Promise<User> {
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
 * Logs the provided error to the console and returns a standardized error object.
 *
 * @param error - The error to be handled. Can be of any type.
 * @returns An object containing a `message` property with the error message if the input is an `Error`,
 *          or a generic message if the error type is unknown.
 */
function renderError(error: unknown): Message {
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
export const fetchUserFavorites = async (): Promise<Favorite[]> => {
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
 * @returns {Promise<Array<{ id: string; rating: number; comment: string; product: { image: string; name: string } }>>}
 *   A promise that resolves to an array of review objects with selected fields.
 *
 * @throws {Error} If the user is not authenticated or if the database query fails.
 */
export const fetchProductReviewsByUser = async (): Promise<
  UserProductReview[]
> => {
  const user = await getAuthUser()
  const reviews = await db.review.findMany({
    where: {
      clerkId: user.id,
    },
    select: {
      id: true,
      rating: true,
      comment: true,
      product: {
        select: {
          image: true,
          name: true,
        },
      },
    },
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
        orderBy: { createdAt: "asc" },
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
async function updateOrCreateCartItem(
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
 */
export const addToCartAction: ActionFunction = async (_prevState, formData) => {
  const userId = (await getAuthUser()).id
  try {
    const productId = formData.get("productId") as string
    const amount = Number(formData.get("amount"))
    const product = await fetchProduct(productId)
    const cart: Cart = await fetchOrCreateCart(userId)
    await updateOrCreateCartItem(productId, cart.id, amount)
    await updateCart(cart)

    return {
      message: `${amount} ${pluralize(product.name, amount)} ${
        amount > 1 ? "have" : "has"
      } been added to your cart`,
    }
  } catch (error) {
    return renderError(error)
  }
}

/**
 * Fetches a product from the database by its unique identifier.
 *
 * @param productId - The unique identifier of the product to fetch.
 * @returns A promise that resolves to the product object if found.
 * @throws {Error} If the product with the given ID is not found.
 */
async function fetchProduct(productId: string) {
  const product = await db.product.findUnique({ where: { id: productId } })
  if (!product) throw new Error(`Product ID ${productId}, not found`)
  return product
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

/**
 * Creates a new order for the authenticated user.
 *
 * Executes a database transaction to:
 *  - Create a new order with cart details and user email.
 *  - Create ordered items for each cart item.
 *  - Delete the user's cart after order creation.
 *
 * On success, this function will redirect to the orders page and never return a value.
 * On error, it returns a message object describing the error.
 *
 * @returns {Promise<Message|never>} A promise that either redirects (never returns) on success,
 * or resolves to an error message object.
 */
export const createOrderAction = async (): Promise<Message|never> => {
  const user = await getAuthUser()
  try {
    const cart = await fetchOrCreateCart(user.id, true)

    // Check for user email before creating the order
    if (!user.emailAddresses?.length)
      throw new Error("User does not have an email address.")

    await db.$transaction(async (tx) => {
      // Create the order
      const order = await tx.order.create({
        data: {
          clerkId: user.id,
          numItems: cart.numItemsInCart,
          orderTotal: cart.orderTotal,
          tax: cart.tax,
          shipping: cart.shipping,
          email: user.emailAddresses[0].emailAddress,
        },
      })
      // Create all the ordered items associated with the order
      await Promise.all(
        cart.cartItems.map((cartItem) =>
          tx.orderedItem.create({
            data: {
              orderId: order.id,
              productId: cartItem.productId,
              amount: cartItem.amount,
              price: cartItem.product.price,
            },
          })
        )
      )
      // Delete the associated cart
      await tx.cart.delete({ where: { id: cart.id } })
    })
  } catch (error) {
    return renderError(error)
  }
  redirect("/orders")
}
