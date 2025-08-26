import { fetchProductReviews } from "@/utils/actions"
import ReviewCard from "./ReviewCard"
import SectionTitle from "../global/SectionTitle"
import ManageableReviewCard from "./ManageableReviewCard"

async function ProductReviews({
  productId,
  currentUserId,
}: {
  productId: string
  currentUserId?: string
}) {
  const reviews = await fetchProductReviews(productId)

  return (
    <div className='mt-16'>
      <SectionTitle text='product reviews' />
      <div className='grid md:grid-cols-2 gap-8 my-8'>
        {reviews.map(
          ({ comment, rating, authorImageUrl, authorName, id, clerkId }) => {
            // Use author name and image for review display
            const reviewInfo = {
              comment,
              rating,
              image: authorImageUrl,
              name: authorName,
              id,
            }
            return currentUserId && clerkId === currentUserId ? (
              <ManageableReviewCard key={id} reviewInfo={reviewInfo} />
            ) : (
              <ReviewCard key={id} reviewInfo={reviewInfo} />
            )
          }
        )}
      </div>
    </div>
  )
}
export default ProductReviews
