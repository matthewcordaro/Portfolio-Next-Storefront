import { createClient } from "@supabase/supabase-js"

const bucket = "product-images"


/**
 * An instance of the Supabase client, configured with the project's URL and API key
 * from environment variables. Use this client to interact with your Supabase backend
 * for authentication, database, storage, and other services.
 *
 * @see {@link https://supabase.com/docs/reference/javascript/initializing}
 */
export const supabase = createClient(
  process.env.SUPABASE_PROJECT_URL as string,
  process.env.SUPABASE_PROJECT_API_KEY as string
)

/**
 * Uploads an image file to the specified Supabase storage bucket with a unique timestamped name.
 *
 * @param image - The image file to upload.
 * @returns A promise that resolves to the public URL of the uploaded image.
 * @throws Will throw an error if the image upload fails.
 */
export const uploadImage = async (image: File) => {
  const timestamp = Date.now()
  const newName = `${timestamp}-${image.name}`

  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(newName, image, { cacheControl: "3600" })
  if (!data) throw new Error("Image upload failed")
  return supabase.storage.from(bucket).getPublicUrl(newName).data.publicUrl
}


/**
 * Deletes an image from the Supabase storage bucket based on its URL.
 *
 * @param url - The full URL of the image to be deleted.
 * @returns A promise that resolves with the result of the remove operation.
 * @throws Will throw an error if the image filename or URL is invalid.
 */
export const deleteImage = async (url: string) => {
  const imageName = url.split("/").pop()
  if (!imageName) throw new Error("Invalid image filename or url")
  return supabase.storage.from(bucket).remove([imageName])
}
