import { fetchProductReviews } from "@/utils/actions"
import ReviewCard from "./ReviewCard"
import SectionTitle from "../global/SectionTitle"
import DeleteReviewButton from "./DeleteReviewButton"
import UpdateReview from "./UpdateReview"

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
            const reviewInfo = {
              comment,
              rating,
              image: authorImageUrl,
              name: authorName,
            }
            return (
              <ReviewCard key={id} reviewInfo={reviewInfo}>
                {currentUserId && clerkId === currentUserId && (
                  <div className='flex items-center gap-x-2'>
                    <UpdateReview reviewId={id} />
                    <DeleteReviewButton reviewId={id} />
                  </div>
                )}
              </ReviewCard>
            )
          }
        )}
      </div>
    </div>
  )
}
export default ProductReviews
