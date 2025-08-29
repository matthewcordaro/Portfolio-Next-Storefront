import { Prisma, Review } from "@prisma/client"

/**
 * Represents the possible values for the Node.js environment.
 *
 * - `"test"`: Used when running tests.
 * - `"development"`: Used during development.
 * - `"production"`: Used in production deployments.
 */
export type NodeEnvironment = "test" | "development" | "production"

/**
 * Represents the possible roles for an authenticated user.
 * - `"user"`: A regular user with standard permissions.
 * - `"admin"`: An administrator with elevated permissions.
 */
export type AuthenticatedUserRole = "user" | "admin"

/**
 * Represents the possible roles for any user, including guests.
 * - `"guest"`: A user who is not authenticated.
 * - `AuthenticatedUserRole`: Any role that an authenticated user can have.
 */
export type UserRole = "guest" | AuthenticatedUserRole

/**
 * Represents a simple message object containing a single string property.
 *
 * @property message - The message text.
 */
export type Message = { message: string; error?: boolean }

/**
 * Represents a function that performs an action based on the previous state and form data,
 * returning a promise that resolves to a `Message`.
 *
 * @param prevState - The previous state before the action is performed.
 * @param formData - The form data to be processed by the action.
 * @returns A promise that resolves to a `Message` object.
 */
export type ActionFunction = (
  prevState: any,
  formData: FormData
) => Promise<Message>

/**
 * Represents a review for a product, extending the base `Review` type.
 * Includes additional product information such as image and name.
 *
 * @property product - An object containing the product's image URL and name.
 */
export type ProductReviewWithProduct = Review & {
  product: {
    image: string
    name: string
  }
}

/**
 * Represents a cart item including its associated product details.
 *
 * This type is derived from Prisma's `CartItemGetPayload` with the `product` relation included.
 * Useful for scenarios where both cart item and product information are required together.
 */
export type CartItemWithProduct = Prisma.CartItemGetPayload<{
  include: { product: true }
}>

/**
 * Represents a shopping cart including its associated cart items and their related product details.
 *
 * This type is derived from Prisma's `CartGetPayload` and includes:
 * - All cart properties.
 * - An array of cart items, each with its corresponding product information.
 *
 * Useful for scenarios where you need to access both cart and product details in a single query result.
 */
export type CartWithProducts = Prisma.CartGetPayload<{
  include: { cartItems: { include: { product: true } } }
}>

/**
 * Represents an order including its associated ordered items.
 *
 * This type is derived from Prisma's `OrderGetPayload` and includes:
 * - All order properties.
 * - An array of ordered items related to the order.
 *
 * Useful for scenarios where you need to access both order and item details in a single query result.
 */
export type OrderWithItems = Prisma.OrderGetPayload<{
  include: { orderedItems: true }
}>

/**
 * Represents a favorite including its associated product details.
 *
 * This type is derived from Prisma's `FavoriteGetPayload` with the `product` relation included.
 * Useful for scenarios where both favorite and product information are required together.
 */
export type FavoriteWithProduct = Prisma.FavoriteGetPayload<{
  include: { product: true }
}>
