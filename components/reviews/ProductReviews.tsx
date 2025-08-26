import { fetchProductReviews } from "@/utils/actions"
import ReviewCard from "./ReviewCard"
import SectionTitle from "../global/SectionTitle"
import ManageableReviewCard from "./ManageableReviewCard"

/**
 * Renders a list of product reviews for a given product.
 * Displays each review using either a `ManageableReviewCard` (if the review belongs to the current user)
 * or a standard `ReviewCard` for other users.
 *
 * @param productId - The unique identifier of the product whose reviews are to be displayed.
 * @param currentUserId - (Optional) The unique identifier of the currently logged-in user.
 *   If provided, reviews authored by this user will be rendered with management capabilities.
 * @returns A React component displaying the product reviews section.
 */
async function ProductReviews({
  productId,
  currentUserId,
}: {
  productId: string
  currentUserId?: string
}) {
  const reviewsOfProduct = await fetchProductReviews(productId)

  return (
    <div className='mt-16'>
      <SectionTitle text='product reviews' />
      <div className='grid md:grid-cols-2 gap-8 my-8'>
        {reviewsOfProduct.map((review) => {
          const { id, clerkId } = review
          return currentUserId && clerkId === currentUserId ? (
            <ManageableReviewCard key={id} review={review} />
          ) : (
            <ReviewCard key={id} review={review} />
          )
        })}
      </div>
    </div>
  )
}
export default ProductReviews
