import { fetchProductReviewsByUser } from "@/utils/actions"
import ReviewCard from "@/components/reviews/ReviewCard"
import SectionTitle from "@/components/global/SectionTitle"
import DeleteReviewButton from "@/components/reviews/DeleteReviewButton"
import UpdateReview from "@/components/reviews/UpdateReview"

async function ReviewsPage() {
  const reviews = await fetchProductReviewsByUser()
  if (reviews.length === 0)
    return <SectionTitle text='you have no reviews yet' />

  return (
    <>
      <SectionTitle text='Your Reviews' />
      <section className='grid md:grid-cols-2 gap-8 mt-4 '>
        {reviews.map((review) => {
          const { comment, rating, id } = review
          const { name, image } = review.product
          const reviewInfo = {
            comment,
            rating,
            name,
            image
          }
          return (
            <ReviewCard key={id} reviewInfo={reviewInfo}>
              <div className='flex items-center gap-x-2'>
                <UpdateReview reviewId={id} />
                <DeleteReviewButton reviewId={id} />
              </div>
            </ReviewCard>
          )
        })}
      </section>
    </>
  )
}

export default ReviewsPage
