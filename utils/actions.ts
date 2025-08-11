"use server"
import { redirect } from "next/navigation"
import db from "./db"
import { currentUser, User } from "@clerk/nextjs/server"
import { imageSchema, productSchema, validateWithZodSchema } from "./schema"
import { uploadImage } from "./supabase"

const getAuthUser = async (): Promise<User> => {
  const user = await currentUser()
  if (!user) redirect("/")
  return user
}

function renderError(error: unknown) {
  console.log(error)
  return {
    message:
      error instanceof Error ? error.message : "an unknown error occurred",
  }
}

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

export const fetchSingleProduct = async (productId: string) => {
  const product = await db.product.findUnique({
    where: { id: productId },
  })
  if (!product) redirect("/products")
  return product
}

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
