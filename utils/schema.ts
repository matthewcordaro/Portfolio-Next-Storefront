import { z, ZodSchema } from "zod"

/**
 * Zod schema for validating product objects.
 *
 * Fields:
 * - `name`: Product name, must be a string with at least 3 characters.
 * - `company`: Company name, must be a string with at least 1 character.
 * - `price`: Product price, coerced to an integer number, must be positive (>= 0).
 * - `description`: Product description, must be a string containing between 10 and 1000 words.
 * - `featured`: Indicates if the product is featured, coerced to a boolean.
 *
 * @remarks
 * The schema uses Zod's coercion for `price` and `featured` to allow flexible input types.
 * The `description` field uses a custom refinement to enforce word count constraints.
 */
export const productSchema = z.object({
  name: z.string().min(3, { message: "name must be at least 3 characters" }),
  company: z
    .string()
    .min(1, { message: "company name must be at least 1 character" }),
  price: z.coerce.number().int().min(0, { message: "price must be positive" }),
  description: z.string().refine(
    (description) => {
      const wordCount = description.split(" ").length
      return wordCount >= 10 && wordCount <= 1000
    },
    { message: "description must be between 10 and 1000 words" }
  ),
  featured: z.coerce.boolean(),
})

/**
 * Validates the provided data against a given Zod schema.
 *
 * @template T - The type inferred from the Zod schema.
 * @param schema - The Zod schema to validate against.
 * @param data - The data to be validated.
 * @returns The validated data, typed as T.
 * @throws {Error} If validation fails, throws an error containing all validation messages.
 */
export function validateWithZodSchema<T>(
  schema: ZodSchema<T>,
  data: unknown
): T {
  const result = schema.safeParse(data)
  if (!result.success) {
    const errors = result.error.errors.map((error) => error.message)
    throw new Error(errors.join(", "))
  }
  return result.data
}

/**
 * Schema for validating an image file object.
 *
 * This schema expects an object with a single property:
 * - `image`: Validated by the `validateImageFile()` function, which should ensure the file meets required image constraints.
 *
 * @see validateImageFile
 */
export const imageSchema = z.object({
  image: validateImageFile(),
})

/**
 * Creates a Zod schema for validating image file uploads.
 *
 * The schema enforces the following constraints:
 * - The file must be an instance of `File`.
 * - The file size must not exceed 5MB.
 * - The file type must start with "image/" (i.e., it must be an image).
 *
 * @returns A Zod schema for validating image files.
 */
function validateImageFile() {
  const maxUploadSizeInMB = 5
  const maxUploadSize = 1024 * 1024 * maxUploadSizeInMB
  const acceptedFileTypes = ["image/"]
  return z
    .instanceof(File)
    .refine((file) => {
      return !file || file.size <= maxUploadSize
    }, "File size must be less than " + maxUploadSizeInMB + "MB")
    .refine((file) => {
      return (
        !file || acceptedFileTypes.some((type) => file.type.startsWith(type))
      )
    }, "File must be an image")
}

/**
 * Zod schema for validating product review objects.
 *
 * Fields:
 * - `productId`: The ID of the product being reviewed, must be a non-empty string.
 * - `authorName`: The name of the review's author, must be a non-empty string.
 * - `authorImageUrl`: URL to the author's image, must be a valid URL.
 * - `rating`: The review rating, must be an integer between 1 and 5.
 * - `comment`: The review comment, must be a string between 10 and 2000 characters.
 */
export const reviewSchema = z.object({
  productId: z.string().min(1, { message: "Product ID cannot be empty" }),
  authorName: z.string().min(1, { message: "Author name cannot be empty" }),
  authorImageUrl: z
    .string()
    .url({ message: "Must be a valid url" }),
  rating: z
    .number()
    .int()
    .min(1, { message: "Min rating of 1" })
    .max(5, { message: "max rating of 5" }),
  comment: z
    .string()
    .min(10, { message: "Comment must be at least 10 characters" })
    .max(2000, { message: "Comment must be at most 2000 characters" }),
})
