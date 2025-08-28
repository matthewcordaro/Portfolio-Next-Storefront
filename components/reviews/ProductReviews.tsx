import ReviewCard from "./ReviewCard"
import SectionTitle from "../global/SectionTitle"
import ManageableReviewCard from "./ManageableReviewCard"
import { Review } from "@prisma/client"

/**
 * Renders a list of product reviews, displaying a special card for reviews authored by the current user.
 *
 * @param currentUserId - The optional ID of the currently authenticated user.
 * @param reviews - An array of review objects to display.
 * @returns A React component displaying the product reviews, with the current user's reviews rendered as manageable cards.
 */
async function ProductReviews({
  currentUserId,
  reviews,
}: {
  currentUserId?: string
  reviews: Review[]
}) {
  return (
    <div className='mt-16'>
      <SectionTitle text='product reviews' />
      <div className='grid md:grid-cols-2 gap-8 my-8'>
        {reviews.map((review) => {
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
