import { fetchProductReviewsByUser } from "@/utils/actions"
import ReviewCard from "@/components/reviews/ReviewCard"
import SectionTitle from "@/components/global/SectionTitle"
import DeleteReviewButton from "@/components/reviews/DeleteReviewButton"

async function ReviewsPage() {
  const reviews = await fetchProductReviewsByUser()
  if (reviews.length === 0)
    return <SectionTitle text='you have no reviews yet' />

  return (
    <>
      <SectionTitle text='Your Reviews' />
      <section className='grid md:grid-cols-2 gap-8 mt-4 '>
        {reviews.map((review) => {
          const { comment, rating } = review
          const { name, image } = review.product
          const reviewInfo = {
            comment,
            rating,
            name,
            image,
          }
          return (
            <ReviewCard key={review.id} reviewInfo={reviewInfo}>
              <DeleteReviewButton reviewId={review.id} />
            </ReviewCard>
          )
        })}
      </section>
    </>
  )
}

export default ReviewsPage
