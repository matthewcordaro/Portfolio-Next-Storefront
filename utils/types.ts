import { Prisma } from "@prisma/client"

/**
 * Represents a simple message object containing a single string property.
 *
 * @property message - The message text.
 */
export type Message = { message: string }

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
 * Represents a review submitted by a user for a product.
 *
 * @property id - Unique identifier for the review.
 * @property rating - Numerical rating given by the user.
 * @property comment - Textual feedback provided by the user.
 * @property product - Information about the reviewed product.
 * @property product.image - URL or path to the product's image.
 * @property product.name - Name of the product being reviewed.
 */
export type UserProductReview = {
  id: string
  rating: number
  comment: string
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
