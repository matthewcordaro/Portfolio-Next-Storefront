import { fetchProductRating } from "@/utils/actions"
import Rating from "../reviews/Rating"

async function ProductRating({ productId }: { productId: string }) {
  const { rating, count } = await fetchProductRating(productId)

  if (count === 0) {
    return (
      <span className='flex gap-1 items-center text-md mt-1 mb-4'>
        This product has no reviews yet
      </span>
    )
  }

  return (
    <span className='flex gap-1 items-center text-md mt-1 mb-4'>
      <Rating rating={Number(rating)} /> {rating} ({count})
    </span>
  )
}
export default ProductRating
