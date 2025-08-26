import ReviewCard from "./ReviewCard"
import UpdateReview from "./UpdateReview"
import DeleteReviewButton from "./DeleteReviewButton"

interface ManageableReviewCardProps {
  reviewInfo: {
    comment: string
    rating: number
    name: string
    image: string
    id: string
  }
}

function ManageableReviewCard({ reviewInfo }: ManageableReviewCardProps) {
  const { id } = reviewInfo
  return (
    <ReviewCard reviewInfo={reviewInfo}>
      <div className='flex items-center gap-x-2'>
        <UpdateReview reviewId={id} />
        <DeleteReviewButton reviewId={id} />
      </div>
    </ReviewCard>
  )
}

export default ManageableReviewCard
