import db from "./db"

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

export const fetchAllProducts = async () => {
  return await db.product.findMany({
    orderBy: {
      createdAt: "desc",
    },
  })
}
