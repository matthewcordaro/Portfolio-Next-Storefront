import { fetchProductReviewsByUser } from "@/utils/actions"
import SectionTitle from "@/components/global/SectionTitle"
import ManageableReviewCard from "@/components/reviews/ManageableReviewCard"

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
          // Use product name and image for review display
          const { name, image } = review.product
          const reviewInfo = {
            comment,
            rating,
            name,
            image,
            id
          }
          return (
            <ManageableReviewCard key={id} reviewInfo={reviewInfo} />
          )
        })}
      </section>
    </>
  )
}

export default ReviewsPage
